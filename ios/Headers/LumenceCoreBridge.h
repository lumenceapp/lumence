#pragma once

#import <Foundation/Foundation.h>

#import "LumenceCore.h"

NS_ASSUME_NONNULL_BEGIN

#ifdef __cplusplus
extern "C" {
#endif

NSString *LumenceCore_ConsumeString(char * _Nullable value);

NSString * _Nullable LumenceCore_ConsumeStringOrNil(char * _Nullable value);

NSString *LumenceCore_ConsumeError(char * _Nullable value);

char * _Nullable LumenceCore_CopyCString(NSString * _Nullable value);

#ifdef __cplusplus
}
#endif

NS_ASSUME_NONNULL_END
