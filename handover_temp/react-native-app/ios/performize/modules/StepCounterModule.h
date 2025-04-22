#import <React/RCTBridgeModule.h>
#import <CoreMotion/CoreMotion.h>

@interface StepCounterModule : NSObject <RCTBridgeModule>

@property (nonatomic, strong) CMPedometer *pedometer;
@property (nonatomic, strong) NSNumber *initialStepCount;
@property (nonatomic, assign) BOOL isTracking;

@end