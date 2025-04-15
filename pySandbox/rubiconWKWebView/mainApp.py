import ctypes
from pathlib import Path
from typing import Union

from pyrubicon.objc.api import ObjCClass, ObjCInstance, Block
from pyrubicon.objc.api import objc_method, objc_property, at
from pyrubicon.objc.runtime import send_super, objc_id, load_library, SEL
from pyrubicon.objc.types import CGRect

from rbedge.enumerations import (
  NSURLRequestCachePolicy,
  UIControlEvents,
  UIBarButtonSystemItem,
  NSKeyValueObservingOptions,
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
  #savePath: Path = objc_property(ctypes.py_object)

  @objc_method
  def dealloc(self):
    # xxx: 呼ばない-> `send_super(__class__, self, 'dealloc')`
    self.wkWebView.removeObserver_forKeyPath_(self, at('title'))
    #print(f'- {NSStringFromClass(__class__)}: dealloc')

  @objc_method
  def init(self):
    send_super(__class__, self, 'init')
    #print(f'\t{NSStringFromClass(__class__)}: init')
    #self.savePath = None
    return self

  @objc_method
  def initWithIndexPath_(self,index_path: ctypes.py_object):
    self.init()  #send_super(__class__, self, 'init')
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
    webConfiguration = WKWebViewConfiguration.new()
    websiteDataStore = WKWebsiteDataStore.nonPersistentDataStore()

    webConfiguration.websiteDataStore = websiteDataStore
    webConfiguration.preferences.setValue_forKey_(
      True, 'allowFileAccessFromFileURLs')

    wkWebView = WKWebView.alloc().initWithFrame_configuration_(
      CGRectZero, webConfiguration)

    #wkWebView.uiDelegate = self
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

    # todo: (.js 等での) `title` 変化を監視
    wkWebView.addObserver_forKeyPath_options_context_(
      self, at('title'), NSKeyValueObservingOptions.new, None)
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
    '''
    if self.savePath is None:
      return 
    '''
    javaScriptString = '''
    (function getShaderCode() {
      const logDiv = document.getElementById('logDiv');
      const textContent = logDiv.textContent;
      return textContent;
    }());
    '''

    def completionHandler(object_id, error_id):
      print(ObjCInstance(object_id))

    #pdbr.state(self.wkWebView)
    #print(self.savePath)
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
    #self.navigationItem.prompt = str(title)
    self.navigationItem.title = str(title)
    

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
    #print('didFinishNavigation')
    #self.navigationItem.title = str(webView.title)
    #self.navigationItem.prompt = str(webView.title)
    title = webView.title
    self.navigationItem.setPrompt_(str(title))
    # todo: observe でtitle 変化の監視をしてるため不要
    #pdbr.state(self.navigationItem)

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

  index_path = Path('./src/index.html')
  save_path = Path('./src/outLogs/wkLog.js')

  main_vc = WebViewController.alloc().initWithIndexPath_(index_path)
  #main_vc.savePath = save_path

  presentation_style = UIModalPresentationStyle.fullScreen
  #presentation_style = UIModalPresentationStyle.pageSheet

  app = App(main_vc, presentation_style)
  app.present()

