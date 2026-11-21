TARGET := iphone:clang:latest:14.0
SDK = iPhoneOS16.5
ARCHS = arm64
INSTALL_TARGET_PROCESSES = Discord
THEOS_PACKAGE_SCHEME = rootless
FINALPACKAGE = 1
VERSION_CODE = 1.0.0

THEOS ?= $(HOME)/theos
export THEOS

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = LumenceTweak

LumenceTweak_FILES = $(wildcard Sources/*.x Sources/*.xm Sources/*.m Sources/*.mm Sources/**/*.x Sources/**/*.xm Sources/**/*.m Sources/**/*.mm)
LumenceTweak_CFLAGS = -fobjc-arc -DPACKAGE_VERSION='@"$(THEOS_PACKAGE_BASE_VERSION)"' -DVERSION_CODE='@"$(VERSION_CODE)"' -I$(THEOS_PROJECT_DIR)/Headers
LumenceTweak_CCFLAGS = -std=c++17 -Wno-c++11-narrowing -I$(THEOS_PROJECT_DIR)/Headers
LumenceTweak_FRAMEWORKS = Foundation UIKit CoreGraphics CoreText CoreFoundation UniformTypeIdentifiers
LumenceTweak_LDFLAGS = -undefined dynamic_lookup -lz

ifneq ($(LUMENCE_CORE_LIB),)
LumenceTweak_LDFLAGS += -Wl,-force_load,$(LUMENCE_CORE_LIB)
else
LumenceTweak_FRAMEWORKS += LumenceCore
LumenceTweak_CFLAGS += -F$(LUMENCE_CORE_FW)
LumenceTweak_CCFLAGS += -F$(LUMENCE_CORE_FW)
LumenceTweak_LDFLAGS += -F$(LUMENCE_CORE_FW) -Wl,-force_load,$(LUMENCE_CORE_FW)/LumenceCore
endif

ifneq ($(LUMENCE_BUNDLE_DIR),)
LumenceTweak_LDFLAGS += -Wl,-sectcreate,__DATA,__vbundle,$(LUMENCE_BUNDLE_DIR)/lumence.bundle
LumenceTweak_LDFLAGS += -Wl,-sectcreate,__DATA,__vmanifest,$(LUMENCE_BUNDLE_DIR)/manifest.json
endif

include $(THEOS_MAKE_PATH)/tweak.mk

after-stage::
	$(ECHO_NOTHING)find $(THEOS_STAGING_DIR) -name ".DS_Store" -delete$(ECHO_END)
ifneq ($(LUMENCE_BUNDLE_DIR),)
	$(ECHO_NOTHING)cp $(LUMENCE_BUNDLE_DIR)/lumence.bundle $(THEOS_STAGING_DIR)/Library/MobileSubstrate/DynamicLibraries/$(ECHO_END)
	$(ECHO_NOTHING)cp $(LUMENCE_BUNDLE_DIR)/manifest.json $(THEOS_STAGING_DIR)/Library/MobileSubstrate/DynamicLibraries/lumence.manifest.json$(ECHO_END)
	$(ECHO_NOTHING)mkdir -p $(THEOS_STAGING_DIR)/Library/MobileSubstrate/DynamicLibraries/LumenceManifest.bundle$(ECHO_END)
	$(ECHO_NOTHING)cp $(LUMENCE_BUNDLE_DIR)/manifest.json $(THEOS_STAGING_DIR)/Library/MobileSubstrate/DynamicLibraries/LumenceManifest.bundle/lumence.manifest.json$(ECHO_END)
endif
