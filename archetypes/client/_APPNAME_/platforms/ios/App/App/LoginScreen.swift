//
//  WelcomeScreen.swift
//  App
//
//  Created by bruno fortunato on 30/11/2016.
//  Copyright © 2016 Bruno Fortunato. All rights reserved.
//

//
//  AJHomeScreen.swift
//  AJLibrary
//
//  Created by Bruno Fortunato on 08/03/16.
//  Copyright © 2016 Bruno Fortunato. All rights reserved.
//

import Foundation
import UIKit
import AJ
import ApplicaFramework

class LoginViewController: AJPluginOwnerViewController {
    
    private var _lastState = AJObject.create()
    
    private var _titleLabel: UILabel?
    private var _emailField: UITextField?
    private var _passwordField: UITextField?
    private var _loginButton: UIButton?
    
    init() {
        super.init(nibName: nil, bundle: nil)
        
        register(plugin: "Alert")
        
        AJ.subscribe(to: Stores.SESSION, owner: self) { [weak self] (state) -> Void in
            if let me = self {
                if state.differs(at: "isLoggedIn").from(me._lastState) {
                    if state.get("isLoggedIn")?.bool ?? false {
                        (UIApplication.shared.delegate as! AppDelegate).replaceRootViewController(HomeViewController())
                    }
                }
                
                me._lastState = state
            }
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        AJ.unsubscribe(from: Stores.SESSION, owner: self)
    }
    
    override func loadView() {
        super.loadView()
        
        Theme.apply(style: .mainView, to: view)
        
        let logo = UIImageView(image: #imageLiteral(resourceName: "logo"))
        logo.frame = RB.withParent(view.frame).sameAs(logo.frame).top(Dimensions.actionBarHeight + Dimensions.padding).left(Dimensions.padding).make()
        
        let closeButton = UIButton(type: .system)
        closeButton.setImage(#imageLiteral(resourceName: "close"), for: .normal)
        closeButton.frame = RB.withParent(view.frame).width(20).height(20).top(Dimensions.padding / 2).left(Dimensions.padding / 2).make()
        closeButton.addTarget(self, action: #selector(close), for: .touchUpInside)
        closeButton.tintColor = Colors.text
        
        _titleLabel = UILabel()
        _titleLabel?.text = M("Login into _APPNAME_")
        Theme.apply(style: .textTitle1, to: _titleLabel!)
        _titleLabel?.sizeToFit()
        _titleLabel?.frame = RB.withParent(view.frame).sameAs(_titleLabel!.frame).bottomOf(logo.frame, offset: Dimensions.quadPadding).left(Dimensions.padding).make()
        
        _emailField = UITextField(
            frame: RB.withParent(view.frame)
                .left(Dimensions.padding)
                .height(60)
                .bottomOf(_titleLabel!.frame, offset: Dimensions.padding)
                .fillWidth(Dimensions.padding)
                .make()
        )
        _emailField?.placeholder = M("Email")
        Theme.apply(style: .loginTextField, to: _emailField!)
        let separator1 = UIView(frame: RB.fitParent(view.frame).bottomOf(_emailField!.frame).height(1).left(Dimensions.padding).fillWidth().make())
        Theme.apply(style: .separator, to: separator1)
        
        _passwordField = UITextField(
            frame: RB.withParent(view.frame)
                .left(Dimensions.padding)
                .height(60)
                .bottomOf(_emailField!.frame, offset: Dimensions.padding)
                .fillWidth(Dimensions.padding)
                .make()
        )
        _passwordField?.isSecureTextEntry = true
        _passwordField?.placeholder = M("Password")
        Theme.apply(style: .loginTextField, to: _passwordField!)
        let separator2 = UIView(frame: RB.fitParent(view.frame).bottomOf(_passwordField!.frame).height(1).left(Dimensions.padding).fillWidth().make())
        Theme.apply(style: .separator, to: separator2)
        
        let loginButton = UIButton(type: .system)
        loginButton.setTitle(M("Login"), for: .normal)
        loginButton.addTarget(self, action: #selector(login), for: .touchUpInside)
        Theme.apply(style: .loginButton, to: loginButton)
        loginButton.frame = RB.withParent(view.frame).sameAs(loginButton.frame).bottomOf(_passwordField!.frame, offset: Dimensions.padding).left(Dimensions.padding).make()
                
        view.addSubview(logo)
        view.addSubview(closeButton)
        view.addSubview(_titleLabel!)
        view.addSubview(_emailField!)
        view.addSubview(separator1)
        view.addSubview(_passwordField!)
        view.addSubview(separator2)
        view.addSubview(loginButton)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        _ = AJ.run(action: Actions.RESUME_SESSION)
    }
    
    func login() {
        if let mail = _emailField?.text, let password = _passwordField?.text {
            _ = AJ.run(action: Actions.LOGIN, data: AJObject.create().set("mail", mail).set("password", password))
        }
    }
    
    func close() {
        self.dismiss(animated: true, completion: nil)
    }
    
    override var prefersStatusBarHidden: Bool {
        get {
            return true
        }
    }
}
