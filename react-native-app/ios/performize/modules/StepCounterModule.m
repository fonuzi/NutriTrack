#import "StepCounterModule.h"
#import <React/RCTLog.h>

@implementation StepCounterModule

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    self.pedometer = [[CMPedometer alloc] init];
    self.isTracking = NO;
    self.initialStepCount = nil;
  }
  return self;
}

RCT_EXPORT_METHOD(isStepCountingAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if ([CMPedometer isStepCountingAvailable]) {
    resolve(@YES);
  } else {
    resolve(@NO);
  }
}

RCT_EXPORT_METHOD(startTracking:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (![CMPedometer isStepCountingAvailable]) {
    reject(@"unavailable", @"Step counting is not available on this device", nil);
    return;
  }
  
  if (self.isTracking) {
    resolve(@{@"status": @"already_tracking"});
    return;
  }
  
  NSDate *now = [NSDate date];
  
  [self.pedometer startPedometerUpdatesFromDate:now
                                 withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
    if (error) {
      RCTLogError(@"Error starting step counter: %@", error);
      return;
    }
    
    if (!self.initialStepCount && pedometerData.numberOfSteps) {
      self.initialStepCount = pedometerData.numberOfSteps;
    }
    
    if (pedometerData.numberOfSteps) {
      NSNumber *steps = @([pedometerData.numberOfSteps integerValue] - [self.initialStepCount integerValue]);
      NSDictionary *eventData = @{@"steps": steps};
      [self sendEventWithName:@"StepCountUpdate" body:eventData];
    }
  }];
  
  self.isTracking = YES;
  resolve(@{@"status": @"tracking_started"});
}

RCT_EXPORT_METHOD(stopTracking:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  if (!self.isTracking) {
    resolve(@{@"status": @"not_tracking"});
    return;
  }
  
  [self.pedometer stopPedometerUpdates];
  self.isTracking = NO;
  self.initialStepCount = nil;
  resolve(@{@"status": @"tracking_stopped"});
}

RCT_EXPORT_METHOD(getStepCountForToday:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (![CMPedometer isStepCountingAvailable]) {
    reject(@"unavailable", @"Step counting is not available on this device", nil);
    return;
  }
  
  NSDate *now = [NSDate date];
  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSDateComponents *components = [calendar components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay fromDate:now];
  NSDate *startOfDay = [calendar dateFromComponents:components];
  
  [self.pedometer queryPedometerDataFromDate:startOfDay
                                     toDate:now
                                withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
    if (error) {
      reject(@"query_error", error.localizedDescription, error);
      return;
    }
    
    NSMutableDictionary *data = [NSMutableDictionary dictionary];
    data[@"steps"] = pedometerData.numberOfSteps ?: @0;
    
    if (pedometerData.distance) {
      data[@"distance"] = pedometerData.distance;
    }
    
    if (pedometerData.floorsAscended) {
      data[@"floorsAscended"] = pedometerData.floorsAscended;
    }
    
    if (pedometerData.floorsDescended) {
      data[@"floorsDescended"] = pedometerData.floorsDescended;
    }
    
    resolve(data);
  }];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"StepCountUpdate"];
}

@end