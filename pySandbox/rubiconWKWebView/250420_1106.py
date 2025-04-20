import ctypes
from pathlib import Path
from typing import Union

from pyrubicon.objc.api import ObjCClass, ObjCInstance, Block
from pyrubicon.objc.api import objc_method, objc_property, at
from pyrubicon.objc.runtime import send_super, objc_id, SEL

from rbedge.enumerations import (
  NSURLRequestCachePolicy,
  UIControlEvents,
  UIBarButtonSystemItem,
  UIBarButtonItemStyle,
  NSTextAlignment,
  NSKeyValueObservingOptions,
  UISwipeGestureRecognizerDirection,
)
from rbedge.globalVariables import UIFontTextStyle
from rbedge.makeZero import CGRectZero
from rbedge.functions import NSStringFromClass
from rbedge import pdbr

UIViewController = ObjCClass('UIViewController')
NSLayoutConstraint = ObjCClass('NSLayoutConstraint')
UIColor = ObjCClass('UIColor')

NSURL = ObjCClass('NSURL')
WKWebView = ObjCClass('WKWebView')
WKWebViewConfiguration = ObjCClass('WKWebViewConfiguration')
WKWebsiteDataStore = ObjCClass('WKWebsiteDataStore')

UISwipeGestureRecognizer = ObjCClass('UISwipeGestureRecognizer')

UIRefreshControl = ObjCClass('UIRefreshControl')
UIBarButtonItem = ObjCClass('UIBarButtonItem')
UIImage = ObjCClass('UIImage')
UILabel = ObjCClass('UILabel')
UIFont = ObjCClass('UIFont')


class WebViewController(UIViewController):

  wkWebView: WKWebView = objc_property()
  titleLabel: UILabel = objc_property()
  indexPath: NSURL = objc_property()
  folderPath: NSURL = objc_property()
  savePath: Path = objc_property(ctypes.py_object)

  @objc_method
  def dealloc(self):
    # xxx: 呼ばない-> `send_super(__class__, self, 'dealloc')`
    #print(f'- {NSStringFromClass(__class__)}: dealloc')
    self.wkWebView.removeObserver_forKeyPath_(self, at('title'))

  @objc_method
  def init(self):
    send_super(__class__, self, 'init')
    #print(f'\t{NSStringFromClass(__class__)}: init')

    self.savePath = None
    return self

  @objc_method
  def initWithIndexPath_(self, index_path: ctypes.py_object):
    self.init()
    #print(f'\t{NSStringFromClass(__class__)}: initWithTargetURL_')

    if not ((target_path := Path(index_path)).exists()):
      return self

    fileURLWithPath = NSURL.fileURLWithPath_isDirectory_
    self.indexPath = fileURLWithPath(str(target_path), False)
    self.folderPath = fileURLWithPath(str(target_path.parent), True)

    return self

  @objc_method
  def loadView(self):
    send_super(__class__, self, 'loadView')
    #print(f'\t{NSStringFromClass(__class__)}: loadView')

    # --- toolbar set up
    self.navigationController.setNavigationBarHidden_animated_(True, True)
    #self.navigationController.setToolbarHidden_animated_(False, True)

    #self.navigationController.setHidesBarsOnSwipe_(True)

    circleImage = UIImage.systemImageNamed_('circle.badge.checkmark')
    saveButtonItem = UIBarButtonItem.alloc().initWithImage(
      circleImage,
      style=UIBarButtonItemStyle.plain,
      target=self,
      action=SEL('doneButtonTapped:'))

    closeImage = UIImage.systemImageNamed_('multiply.circle')
    closeButtonItem = UIBarButtonItem.alloc().initWithImage(
      closeImage,
      style=UIBarButtonItemStyle.plain,
      target=self,
      action=SEL('doneButtonTapped:'))

    titleLabel = UILabel.new()
    titleLabel.setTextAlignment_(NSTextAlignment.center)
    titleLabel.setFont_(
      UIFont.preferredFontForTextStyle_(UIFontTextStyle.caption1))

    titleButtonItem = UIBarButtonItem.alloc().initWithCustomView_(titleLabel)

    flexibleSpace = UIBarButtonSystemItem.flexibleSpace
    flexibleSpaceBarButtonItem = UIBarButtonItem.alloc(
    ).initWithBarButtonSystemItem(flexibleSpace, target=None, action=None)

    toolbarButtonItems = [
      saveButtonItem,
      flexibleSpaceBarButtonItem,
      titleButtonItem,
      flexibleSpaceBarButtonItem,
      closeButtonItem,
    ]

    self.setToolbarItems_animated_(toolbarButtonItems, True)

    # --- WKWebView set up
    webConfiguration = WKWebViewConfiguration.new()
    websiteDataStore = WKWebsiteDataStore.nonPersistentDataStore()

    webConfiguration.websiteDataStore = websiteDataStore
    webConfiguration.preferences.setValue_forKey_(
      True, 'allowFileAccessFromFileURLs')

    wkWebView = WKWebView.alloc().initWithFrame_configuration_(
      CGRectZero, webConfiguration)

    #wkWebView.uiDelegate = self
    wkWebView.navigationDelegate = self

    #addGestureRecognizer
    wkWebView.scrollView.bounces = True

    downSwipeDownGesture = UISwipeGestureRecognizer.alloc(
    ).initWithTarget_action_(self, SEL('downSwipeAction:'))
    downSwipeDownGesture.setDirection_(UISwipeGestureRecognizerDirection.down)
    #downSwipeDownGesture.delegate = self
    self.view.addGestureRecognizer_(downSwipeDownGesture)
    #wkWebView.addGestureRecognizer_(downSwipeDownGesture)

    upSwipeDownGesture = UISwipeGestureRecognizer.alloc(
    ).initWithTarget_action_(self, SEL('upSwipeAction:'))
    upSwipeDownGesture.setDirection_(UISwipeGestureRecognizerDirection.up)
    self.view.addGestureRecognizer_(upSwipeDownGesture)

    #pdbr.state(swipeDownGesture)

    #wkWebView.addGestureRecognizer_

    refreshControl = UIRefreshControl.new()
    refreshControl.addTarget_action_forControlEvents_(
      self, SEL('refreshWebView:'), UIControlEvents.valueChanged)
    wkWebView.scrollView.refreshControl = refreshControl

    wkWebView.loadFileURL_allowingReadAccessToURL_(self.indexPath,
                                                   self.folderPath)

    # todo: (.js 等での) `title` 変化を監視
    wkWebView.addObserver_forKeyPath_options_context_(
      self, at('title'), NSKeyValueObservingOptions.new, None)

    self.titleLabel = titleLabel
    self.wkWebView = wkWebView

  @objc_method
  def downSwipeAction_(self):
    print('dwon')
    #systemDarkPurpleColor
    #systemDarkOrangeColor
    self.navigationController.setToolbarHidden_animated_(True, True)
    self.navigationController.setNavigationBarHidden_animated_(True, True)
    self.view.backgroundColor = UIColor.systemDarkPurpleColor()

  @objc_method
  def upSwipeAction_(self):
    print('up')
    #systemDarkPurpleColor
    #systemDarkOrangeColor
    self.navigationController.setToolbarHidden_animated_(False, True)
    self.navigationController.setNavigationBarHidden_animated_(True, True)
    self.view.backgroundColor = UIColor.systemDarkOrangeColor()

  @objc_method
  def viewDidLoad(self):
    send_super(__class__, self, 'viewDidLoad')
    #print(f'\t{NSStringFromClass(__class__)}: viewDidLoad')

    # --- Navigation
    self.navigationItem.title = NSStringFromClass(__class__) if (
      title := self.navigationItem.title) is None else title
    self.view.backgroundColor = UIColor.systemBackgroundColor()
    #self.view.backgroundColor = UIColor.systemDarkRedColor()

    # --- Layout
    self.view.addSubview_(self.wkWebView)
    self.wkWebView.translatesAutoresizingMaskIntoConstraints = False
    '''
    NSLayoutConstraint.activateConstraints_([
      self.wkWebView.topAnchor.constraintEqualToAnchor_(
        self.view.safeAreaLayoutGuide.topAnchor),
      self.wkWebView.bottomAnchor.constraintEqualToAnchor_(
        self.view.bottomAnchor),
    
      #self.wkWebView.leftAnchor.constraintEqualToAnchor_(self.view.leftAnchor),
      #self.wkWebView.rightAnchor.constraintEqualToAnchor_(self.view.rightAnchor),
      
      self.wkWebView.widthAnchor.constraintEqualToAnchor_multiplier_(
        self.view.widthAnchor, 0.5),
    ])
    '''
    
    layoutGuide=self.view.safeAreaLayoutGuide

    NSLayoutConstraint.activateConstraints_([
      self.wkWebView.centerXAnchor.constraintEqualToAnchor_(
        self.view.centerXAnchor),
      self.wkWebView.centerYAnchor.constraintEqualToAnchor_(
        self.view.centerYAnchor),
      self.wkWebView.widthAnchor.constraintEqualToAnchor_multiplier_(
        self.view.widthAnchor, 0.5),
      #self.wkWebView.heightAnchor.constraintEqualToAnchor_multiplier_(self.view.heightAnchor, 1.0),
      self.wkWebView.bottomAnchor.constraintEqualToAnchor_(
        layoutGuide.bottomAnchor),
    ])

  @objc_method
  def viewWillAppear_(self, animated: bool):
    send_super(__class__,
               self,
               'viewWillAppear:',
               animated,
               argtypes=[
                 ctypes.c_bool,
               ])
    #print(f'\t{NSStringFromClass(__class__)}: viewWillAppear_')
    #self.wkWebView.reloadFromOrigin()

  @objc_method
  def viewDidAppear_(self, animated: bool):
    send_super(__class__,
               self,
               'viewDidAppear:',
               animated,
               argtypes=[
                 ctypes.c_bool,
               ])
    #print(f'\t{NSStringFromClass(__class__)}: viewDidAppear_')
    #self.wkWebView.reload()

  @objc_method
  def viewWillDisappear_(self, animated: bool):
    send_super(__class__,
               self,
               'viewWillDisappear:',
               animated,
               argtypes=[
                 ctypes.c_bool,
               ])
    # print(f'\t{NSStringFromClass(__class__)}: viewWillDisappear_')

    if self.savePath is None or not (self.savePath.exists()):
      return

    javaScriptString = '''
    (function getShaderCode() {
      const logDiv = document.getElementById('logDiv');
      const textContent = logDiv.textContent;
      return textContent;
    }());
    '''

    def completionHandler(object_id, error_id):
      objc_instance = ObjCInstance(object_id)
      self.savePath.write_text(str(objc_instance), encoding='utf-8')

    self.wkWebView.evaluateJavaScript_completionHandler_(
      at(javaScriptString),
      Block(completionHandler, None, *[
        objc_id,
        objc_id,
      ]))

  @objc_method
  def viewDidDisappear_(self, animated: bool):
    send_super(__class__,
               self,
               'viewDidDisappear:',
               animated,
               argtypes=[
                 ctypes.c_bool,
               ])
    #print(f'\t{NSStringFromClass(__class__)}: viewDidDisappear_')

  @objc_method
  def didReceiveMemoryWarning(self):
    send_super(__class__, self, 'didReceiveMemoryWarning')
    print(f'{__class__}: didReceiveMemoryWarning')

  # --- WKUIDelegate
  # --- WKNavigationDelegate
  @objc_method
  def webView_didCommitNavigation_(self, webView, navigation):
    # 遷移開始時
    #print('didCommitNavigation')
    pass

  @objc_method
  def webView_didFailNavigation_withError_(self, webView, navigation, error):
    # 遷移中にエラーが発生した時
    # xxx: 未確認
    print('didFailNavigation_withError')
    print(error)

  @objc_method
  def webView_didFailProvisionalNavigation_withError_(self, webView,
                                                      navigation, error):
    # ページ読み込み時にエラーが発生した時
    print('didFailProvisionalNavigation_withError')
    print(error)

  @objc_method
  def webView_didFinishNavigation_(self, webView, navigation):
    # ページ読み込みが完了した時
    pass

  @objc_method
  def webView_didReceiveServerRedirectForProvisionalNavigation_(
      self, webView, navigation):
    # リダイレクトされた時
    # xxx: 未確認
    print('didReceiveServerRedirectForProvisionalNavigation')

  @objc_method
  def webView_didStartProvisionalNavigation_(self, webView, navigation):
    # ページ読み込みが開始された時
    #print('didStartProvisionalNavigation')
    pass

  @objc_method
  def doneButtonTapped_(self, sender):
    #pdbr.state(self.navigationController.navigationBar)
    self.dismissViewControllerAnimated_completion_(True, None)

  @objc_method
  def reLoadWebView_(self, sender):
    self.wkWebView.reload()
    #self.wkWebView.reloadFromOrigin()

  @objc_method
  def refreshWebView_(self, sender):
    self.reLoadWebView_(sender)
    sender.endRefreshing()

  @objc_method
  def observeValueForKeyPath_ofObject_change_context_(self, keyPath, objct,
                                                      change, context):
    title = self.wkWebView.title
    self.titleLabel.setText_(str(title))
    self.titleLabel.sizeToFit()


if __name__ == '__main__':
  from rbedge.app import App
  from rbedge.enumerations import UIModalPresentationStyle

  index_path = Path('./src/index.html')
  save_path = Path('./src/outLogs/wkLog.js')

  main_vc = WebViewController.alloc().initWithIndexPath_(index_path)
  #main_vc.savePath = save_path

  presentation_style = UIModalPresentationStyle.fullScreen
  #presentation_style = UIModalPresentationStyle.pageSheet

  app = App(main_vc, presentation_style)
  app.present()

