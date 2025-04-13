from dataclasses import dataclass


# ref: [UIModalPresentationStyle | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle)
class UIModalPresentationStyle:
  automatic: int = -2
  none: int = -1
  fullScreen: int = 0
  pageSheet: int = 1
  formSheet: int = 2
  currentContext: int = 3
  custom: int = 4
  overFullScreen: int = 5
  overCurrentContext: int = 6
  popover: int = 7
  blurOverFullScreen: int = 8


# ref: [UIRectEdge | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uirectedge?language=objc)
@dataclass
class UIRectEdge:
  none: int = 0
  top: int = 1 << 0
  left: int = 1 << 1
  bottom: int = 1 << 2
  right: int = 1 << 3
  all: int = top | left | bottom | right


# ref: [UIBarButtonSystemItem | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uibarbuttonsystemitem?language=objc)
class UIBarButtonSystemItem:
  done: int = 0
  cancel: int = 1
  edit: int = 2
  add: int = 4
  flexibleSpace: int = 5
  fixedSpace: int = 6
  compose: int = 7
  reply: int = 8
  action: int = 9
  organize: int = 10
  bookmarks: int = 11
  search: int = 12
  refresh: int = 13
  stop: int = 14
  trash: int = 16
  play: int = 17
  pause: int = 18
  rewind: int = 19
  fastForward: int = 20
  undo: int = 21
  redo: int = 22
  pageCurl: int = 23  # Deprecated
  close: int = 24


# ref: [UISceneActivationState | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiscene/activationstate-swift.enum?language=objc)
class UISceneActivationState:
  # ref: [UISceneDefinitions.rs - source](https://docs.rs/objc2-ui-kit/latest/src/objc2_ui_kit/generated/UISceneDefinitions.rs.html#12)
  unattached: int = -1
  foregroundActive: int = 0
  foregroundInactive: int = 1
  background: int = 2


# ref: [UIControlEvents | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uicontrolevents?language=objc)
@dataclass
class UIControlEvents:
  touchDown: int = 1 << 0
  touchDownRepeat: int = 1 << 1
  touchDragInside: int = 1 << 2
  touchDragOutside: int = 1 << 3
  touchDragEnter: int = 1 << 4
  touchDragExit: int = 1 << 5
  touchUpInside: int = 1 << 6
  touchUpOutside: int = 1 << 7
  touchCancel: int = 1 << 8
  valueChanged: int = 1 << 12
  menuActionTriggered: int = 1 << 14
  primaryActionTriggered: int = 1 << 13
  editingDidBegin: int = 1 << 16
  editingChanged: int = 1 << 17
  editingDidEnd: int = 1 << 18
  editingDidEndOnExit: int = 1 << 19
  allTouchEvents: int = 0x00000FFF
  allEditingEvents: int = 0x000F0000
  applicationReserved: int = 0x0F000000
  systemReserved: int = 0xF0000000
  allEvents: int = 0xFFFFFFFF


# ref: [UITableViewStyle | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uitableviewstyle?language=objc)
class UITableViewStyle:
  # ref: [UITableView.rs - source](https://docs.rs/objc2-ui-kit/latest/src/objc2_ui_kit/generated/UITableView.rs.html#19)
  plain: int = 0
  grouped: int = 1
  insetGrouped: int = 2


# ref: [NSURLRequestCachePolicy | Apple Developer Documentation](https://developer.apple.com/documentation/foundation/nsurlrequestcachepolicy)
@dataclass
class NSURLRequestCachePolicy:
  useProtocolCachePolicy: int = 0
  reloadIgnoringLocalCacheData: int = 1
  reloadIgnoringLocalAndRemoteCacheData: int = 4
  reloadIgnoringCacheData: int = reloadIgnoringLocalCacheData
  returnCacheDataElseLoad: int = 2
  returnCacheDataDontLoad: int = 3
  reloadRevalidatingCacheData: int = 5


# ref: [WKNavigationActionPolicy | Apple Developer Documentation](https://developer.apple.com/documentation/webkit/wknavigationactionpolicy?language=objc)
class WKNavigationActionPolicy:
  cancel: int = 0
  allow: int = 1
  download: int = 2

