import ctypes
from pathlib import Path
from typing import Union
import datetime

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

UIRefreshControl = ObjCClass('UIRefreshControl')
UIBarButtonItem = ObjCClass('UIBarButtonItem')
UIImage = ObjCClass('UIImage')
UILabel = ObjCClass('UILabel')
UIFont = ObjCClass('UIFont')


class WebViewController(UIViewController):

  wkWebView: WKWebView = objc_property()
  titleLabel: UILabel = objc_property()

  indexPathObject: Path = objc_property(ctypes.py_object)
  savePathObject: Path = objc_property(ctypes.py_object)

  @objc_method
  def dealloc(self):
    # xxx: 呼ばない-> `send_super(__class__, self, 'dealloc')`
    #print(f'- {NSStringFromClass(__class__)}: dealloc')
    self.wkWebView.removeObserver_forKeyPath_(self, at('title'))

  @objc_method
  def init(self):
    send_super(__class__, self, 'init')
    #print(f'\t{NSStringFromClass(__class__)}: init')
    self.indexPathObject = None
    self.savePathObject = None
    return self

  @objc_method
  def initWithIndexPath_(self, index_path: ctypes.py_object):
    self.init()
    #print(f'\t{NSStringFromClass(__class__)}: initWithTargetURL_')
    if not (Path(index_path).exists()):
      return self

    self.indexPathObject = index_path

    return self

  @objc_method
  def loadView(self):
    send_super(__class__, self, 'loadView')
    #print(f'\t{NSStringFromClass(__class__)}: loadView')
    # --- toolbar set up
    self.navigationController.setNavigationBarHidden_animated_(True, True)
    self.navigationController.setToolbarHidden_animated_(False, True)

    saveUpdateImage = UIImage.systemImageNamed_('circle.badge.checkmark')
    saveUpdateButtonItem = UIBarButtonItem.alloc().initWithImage(
      saveUpdateImage,
      style=UIBarButtonItemStyle.plain,
      target=self,
      action=SEL('saveFileAction:'))

    closeImage = UIImage.systemImageNamed_('multiply.circle')
    closeButtonItem = UIBarButtonItem.alloc().initWithImage(
      closeImage,
      style=UIBarButtonItemStyle.plain,
      target=self.navigationController,
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
      saveUpdateButtonItem,
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
    wkWebView.scrollView.bounces = True

    refreshControl = UIRefreshControl.new()
    refreshControl.addTarget_action_forControlEvents_(
      self, SEL('refreshWebView:'), UIControlEvents.valueChanged)
    wkWebView.scrollView.refreshControl = refreshControl

    # todo: (.js 等での) `title` 変化を監視
    wkWebView.addObserver_forKeyPath_options_context_(
      self, at('title'), NSKeyValueObservingOptions.new, None)

    self.titleLabel = titleLabel
    self.wkWebView = wkWebView

  @objc_method
  def viewDidLoad(self):
    send_super(__class__, self, 'viewDidLoad')
    #print(f'\t{NSStringFromClass(__class__)}: viewDidLoad')

    # --- Navigation
    self.navigationItem.title = NSStringFromClass(__class__) if (
      title := self.navigationItem.title) is None else title
    self.view.backgroundColor = UIColor.systemFillColor()

    self.loadFileIndexPath()

    # --- Layout
    self.view.addSubview_(self.wkWebView)
    self.wkWebView.translatesAutoresizingMaskIntoConstraints = False

    layoutGuide = self.view.safeAreaLayoutGuide

    NSLayoutConstraint.activateConstraints_([
      self.wkWebView.topAnchor.constraintEqualToAnchor_(layoutGuide.topAnchor),
      self.wkWebView.bottomAnchor.constraintEqualToAnchor_(
        layoutGuide.bottomAnchor),
      self.wkWebView.leftAnchor.constraintEqualToAnchor_(
        layoutGuide.leftAnchor),
      self.wkWebView.rightAnchor.constraintEqualToAnchor_(
        layoutGuide.rightAnchor),
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
    #print(f'\t{NSStringFromClass(__class__)}: viewWillDisappear_')

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
    pass

  # --- private
  @objc_method
  def loadFileIndexPath(self):
    #fileURLWithPath = NSURL.fileURLWithPath_isDirectory_
    loadFileURL = NSURL.fileURLWithPath_isDirectory_(str(self.indexPathObject),
                                                     False)
    allowingReadAccessToURL = NSURL.fileURLWithPath_isDirectory_(
      str(self.indexPathObject.parent), True)

    self.wkWebView.loadFileURL_allowingReadAccessToURL_(
      loadFileURL, allowingReadAccessToURL)

  @objc_method
  def observeValueForKeyPath_ofObject_change_context_(self, keyPath, objct,
                                                      change, context):
    title = self.wkWebView.title
    self.titleLabel.setText_(str(title))
    self.titleLabel.sizeToFit()

  @objc_method
  def doneButtonTapped_(self, sender):
    #self.visibleViewController.dismissViewControllerAnimated_completion_(True, None)
    self.navigationController.doneButtonTapped(sender)

  @objc_method
  def reLoadWebView_(self, sender):
    self.wkWebView.reload()
    #self.wkWebView.reloadFromOrigin()

  @objc_method
  def refreshWebView_(self, sender):
    self.reLoadWebView_(sender)
    sender.endRefreshing()

  @objc_method
  def saveFileAction_(self, sender):
    if self.savePathObject is None or not (self.savePathObject.exists()):
      return

    javaScriptString = '''
    (function getShaderCode() {
      const logDiv = document.getElementById('logDiv');
      const textContent = logDiv.textContent;
      return textContent;
    }());
    '''
    '''
    def completionHandler(object_id, error_id):
      objc_instance = ObjCInstance(object_id)
      self.savePathObject.write_text(str(objc_instance), encoding='utf-8')

    self.wkWebView.evaluateJavaScript_completionHandler_(
      at(javaScriptString),
      Block(completionHandler, None, *[
        objc_id,
        objc_id,
      ]))
    '''
    text = '''\
// import eruda from "https://esm.sh/eruda@3.0.1"
// eruda.init()

console.log(1);

//document.title = `js top title title title title title title title title title title`;

function addElement() {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id","logDiv");

  const newContent = document.createTextNode("みなさん、こんにちは!%s");

  newDiv.appendChild(newContent);

  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}

document.addEventListener("DOMContentLoaded", (event) => {
  console.log(2);
  addElement()
});


window.addEventListener("load", (event) => {
  console.log(3);
  //document.title = `js load titletitle title title title title title title title title title`;
  const logDiv = document.getElementById("logDiv");
  const textContent = logDiv.textContent;
  console.log(textContent);
});

console.log(4);
    ''' % (str(datetime.datetime.now()))

    self.savePathObject.write_text(text, encoding='utf-8')

    try:
      import editor
    except (ModuleNotFoundError, LookupError):
      return

    def open_file(url: Path, tab: bool):
      editor.open_file(f'{url.resolve()}', tab)

    # todo: save したfile editor 上のバッファを最新にする
    open_file(self.savePathObject, True)
    dummy_path = Path(editor.__file__)
    while _path := dummy_path:
      if (dummy_path := _path).name == 'Pythonista3.app':
        break
      dummy_path = _path.parent
    open_file(Path('./', dummy_path, 'Welcome3.md'), False)
    open_file(self.savePathObject, False)


if __name__ == '__main__':
  from rbedge.app import App
  from rbedge.enumerations import UIModalPresentationStyle

  index_path = Path('./src/index.html')
  save_path = Path('./src/js/main.js')

  main_vc = WebViewController.alloc().initWithIndexPath_(index_path)
  main_vc.savePathObject = save_path

  presentation_style = UIModalPresentationStyle.fullScreen
  #presentation_style = UIModalPresentationStyle.pageSheet

  app = App(main_vc, presentation_style)
  app.present()

