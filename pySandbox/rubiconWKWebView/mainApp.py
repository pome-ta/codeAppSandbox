import ctypes
from pathlib import Path
from typing import Union

from pyrubicon.objc.api import ObjCClass, ObjCProtocol
from pyrubicon.objc.api import objc_method, objc_property
from pyrubicon.objc.runtime import send_super, load_library, SEL
from pyrubicon.objc.types import CGRect

from rbedge.enumerations import (
  NSURLRequestCachePolicy,
  UIControlEvents,
  UIBarButtonSystemItem,
)
from rbedge.functions import NSStringFromClass
from rbedge import pdbr

CoreGraphics = load_library('CoreGraphics')
CGRectZero = CGRect.in_dll(CoreGraphics, 'CGRectZero')

UIViewController = ObjCClass('UIViewController')
NSLayoutConstraint = ObjCClass('NSLayoutConstraint')
UIColor = ObjCClass('UIColor')

NSURL = ObjCClass('NSURL')

WKWebView = ObjCClass('WKWebView')
WKWebViewConfiguration = ObjCClass('WKWebViewConfiguration')
WKWebsiteDataStore = ObjCClass('WKWebsiteDataStore')

UIRefreshControl = ObjCClass('UIRefreshControl')
UIBarButtonItem = ObjCClass('UIBarButtonItem')


class WebViewController(UIViewController):

  wkWebView: WKWebView = objc_property()
  indexPath: NSURL = objc_property()
  folderPath: NSURL = objc_property()

  @objc_method
  def dealloc(self):
    # xxx: 呼ばない-> `send_super(__class__, self, 'dealloc')`
    #print(f'- {NSStringFromClass(__class__)}: dealloc')
    pass

  @objc_method
  def init(self):
    send_super(__class__, self, 'init')
    #print(f'\t{NSStringFromClass(__class__)}: init')
    return self

  @objc_method
  def initWithLocalPath_(self, localPath: ctypes.py_object):
    self.init()  #send_super(__class__, self, 'init')
    #print(f'\t{NSStringFromClass(__class__)}: initWithTargetURL_')

    if not ((target_path := Path(localPath)).exists()):
      return self

    fileURLWithPath = NSURL.fileURLWithPath_isDirectory_

    self.indexPath = fileURLWithPath(str(target_path), False)
    self.folderPath = fileURLWithPath(str(target_path.parent), True)

    return self

  @objc_method
  def loadView(self):
    send_super(__class__, self, 'loadView')
    #print(f'\t{NSStringFromClass(__class__)}: loadView')
    webConfiguration = WKWebViewConfiguration.new()
    websiteDataStore = WKWebsiteDataStore.nonPersistentDataStore()

    webConfiguration.websiteDataStore = websiteDataStore
    webConfiguration.preferences.setValue_forKey_(
      True, 'allowFileAccessFromFileURLs')

    wkWebView = WKWebView.alloc().initWithFrame_configuration_(
      CGRectZero, webConfiguration)

    wkWebView.navigationDelegate = self
    wkWebView.scrollView.bounces = True

    refreshButtonItem = UIBarButtonItem.alloc().initWithBarButtonSystemItem(
      UIBarButtonSystemItem.refresh, target=self, action=SEL('reLoadWebView:'))
    self.navigationItem.rightBarButtonItem = refreshButtonItem

    refreshControl = UIRefreshControl.new()
    refreshControl.addTarget_action_forControlEvents_(
      self, SEL('refreshWebView:'), UIControlEvents.valueChanged)
    wkWebView.scrollView.refreshControl = refreshControl

    wkWebView.loadFileURL_allowingReadAccessToURL_(self.indexPath,
                                                   self.folderPath)

    
    self.navigationItem.title = str(wkWebView.title)
    self.wkWebView = wkWebView

  @objc_method
  def viewDidLoad(self):
    send_super(__class__, self, 'viewDidLoad')
    #print(f'\t{NSStringFromClass(__class__)}: viewDidLoad')

    # --- Navigation
    self.navigationItem.title = NSStringFromClass(__class__) if (
      title := self.navigationItem.title) is None else title

    # --- Layout
    self.view.addSubview_(self.wkWebView)
    self.wkWebView.translatesAutoresizingMaskIntoConstraints = False

    #areaLayoutGuide = self.view.safeAreaLayoutGuide
    #areaLayoutGuide = self.view.layoutMarginsGuide
    areaLayoutGuide = self.view

    NSLayoutConstraint.activateConstraints_([
      self.wkWebView.centerXAnchor.constraintEqualToAnchor_(
        areaLayoutGuide.centerXAnchor),
      self.wkWebView.centerYAnchor.constraintEqualToAnchor_(
        areaLayoutGuide.centerYAnchor),
      self.wkWebView.widthAnchor.constraintEqualToAnchor_multiplier_(
        areaLayoutGuide.widthAnchor, 1.0),
      self.wkWebView.heightAnchor.constraintEqualToAnchor_multiplier_(
        areaLayoutGuide.heightAnchor, 1.0),
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
    print(f'viewWillAppear: {self.wkWebView.title}')

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
    print(f'viewDidAppear: {self.wkWebView.title}')

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
    print(f'viewWillDisappear: {self.wkWebView.title}')

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

  @objc_method
  def reLoadWebView_(self, sender):
    self.wkWebView.reload()

  @objc_method
  def refreshWebView_(self, sender):
    self.reLoadWebView_(sender)
    sender.endRefreshing()

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
    #print('didFinishNavigation')
    title = webView.title
    #self.navigationItem.title = str(title)

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


if __name__ == '__main__':
  from rbedge.app import App
  from rbedge.enumerations import UIModalPresentationStyle

  local_path = Path('./src/index.html')

  main_vc = WebViewController.alloc().initWithLocalPath_(local_path)

  presentation_style = UIModalPresentationStyle.fullScreen
  #presentation_style = UIModalPresentationStyle.pageSheet

  app = App(main_vc, presentation_style)
  app.present()

