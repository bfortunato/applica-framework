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

class WelcomeViewController: UIViewController {

    private var _lastState = AJObject.create()

    init() {
        super.init(nibName: nil, bundle: nil)
        
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
        
        Theme.apply(style: .mainViewInverse, to: view)
        
        let logo = UIImageView(image: #imageLiteral(resourceName: "logo"))
        logo.frame = RB.withParent(view.frame).sameAs(logo.frame).top(Dimensions.actionBarHeight + Dimensions.padding).left(Dimensions.padding).make()
        
        let titleLabel = UILabel()
        titleLabel.text = M("Welcome to\n_APPNAME_")
        titleLabel.numberOfLines = 2
        Theme.apply(style: .textJumbotronInverse, to: titleLabel)
        titleLabel.sizeToFit()
        titleLabel.frame = RB.withParent(view.frame).sameAs(titleLabel.frame).vcenter(-Dimensions.quadPadding).left(Dimensions.padding).make()
        
        let loginButton = UIButton(type: .system)
        loginButton.setTitle(M("Login"), for: .normal)
        loginButton.frame = RB.withParent(view.frame).left(Dimensions.padding).fillWidth(Dimensions.padding).height(Dimensions.buttonHeight).bottom(Dimensions.padding).right(Dimensions.padding).make()
        loginButton.addTarget(self, action: #selector(login), for: .touchUpInside)
        Theme.apply(style: .welcomeButtonLogin, to: loginButton)
        
        let registerButton = UIButton(type: .system)
        registerButton.setTitle(M("Sign up"), for: .normal)
        registerButton.frame = RB.withParent(view.frame).left(Dimensions.padding).fillWidth(Dimensions.padding).height(Dimensions.buttonHeight).topOf(loginButton.frame, offset: Dimensions.padding).right(Dimensions.padding).make()
        registerButton.addTarget(self, action: #selector(register), for: .touchUpInside)
        Theme.apply(style: .welcomeButtonSignup, to: registerButton)
        
        
        view.addSubview(logo)
        view.addSubview(titleLabel)
        view.addSubview(registerButton)
        view.addSubview(loginButton)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        _ = AJ.run(action: Actions.RESUME_SESSION)
    }
    
    func login() {
        present(LoginViewController(), animated: true, completion: nil)
    }
    
    func register() {
        present(LoginViewController(), animated: true, completion: nil)
    }
    
    override var prefersStatusBarHidden: Bool {
        get {
            return true
        }
    }
}
