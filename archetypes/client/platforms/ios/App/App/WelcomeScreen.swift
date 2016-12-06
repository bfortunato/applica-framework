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
    
    private var _formView: UIView?
    private var _emailField: UITextField?
    private var _passwordField: UITextField?
    private var _loginButton: UIButton?
    private var _forgotButton: UIButton?
    private var _loader: AFLoader?
    private var _indicator: UIActivityIndicatorView?
    
    
    init() {
        super.init(nibName: nil, bundle: nil)
        
        AJ.subscribe(to: Stores.SESSION, owner: self) { [weak self] (state) -> Void in
            
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
        
        let backgroundImage = UIImageView(image: nil)
        backgroundImage.frame = self.view.bounds
        
        _indicator = UIActivityIndicatorView(activityIndicatorStyle: .whiteLarge)
        _indicator!.center = backgroundImage.center
        _indicator!.startAnimating()
        backgroundImage.addSubview(_indicator!)
        
        let width = view.bounds.width - Dimensions.padding * 2
        
        _formView = UIView()
        _formView?.backgroundColor = UIColor.white
        _formView?.isHidden = true
        _formView?.frame = RB.withParent(view.frame).width(width).height(220).vcenter().center().make()
        
        _emailField = UITextField()
        _emailField?.frame = RB.withParent(_formView!.frame).sameAs(_emailField!.frame).width(width).center().make()
        
        _passwordField = UITextField()
        _passwordField?.sizeToFit()
        _passwordField?.frame = RB.withParent(_formView!.frame).width(width).height(Dimensions.textFieldHeight).bottomOf(_emailField.frame).center().make()
        
        _loginButton = UIButton()
        _loginButton?.setTitle("ACCEDI", for: .normal)
        _loginButton?.sizeToFit()
        _loginButton?.frame = RB.withParent(_formView!.frame).sameAs(_loginButton!.frame).bottomOf(_passwordField!.frame, offset: Dimensions.doublePadding).center().make()
        _loginButton?.addTarget(self, action: #selector(self.login), for: .touchUpInside)
        
        _forgotButton = UIButton()
        _forgotButton?.setTitle("Hai dimenticato la password?", for: .normal)
        _forgotButton?.setTitleColor(Colors.placeholderText, for: .normal)
        _forgotButton?.titleLabel?.font = _forgotButton!.titleLabel?.font.withSize(Dimensions.smallFont)
        _forgotButton?.sizeToFit()
        _forgotButton?.frame = RB.withParent(_formView!.frame).sameAs(_forgotButton!.frame).bottomOf(_loginButton!.frame, offset: Dimensions.padding).center().make()
        _forgotButton?.addTarget(self, action: #selector(self.forgotPassword), for: .touchUpInside)
        
        _formView?.addSubview(_emailField!)
        _formView?.addSubview(_passwordField!)
        _formView?.addSubview(_loginButton!)
        _formView?.addSubview(_forgotButton!)
        
        view.addSubview(backgroundImage)
        view.addSubview(_formView!)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        _ = AJ.run(action: Actions.RESUME_SESSION)
    }
    
    func login() {
        _loader = AFLoader.show()
        _ = AJ.run(action: Actions.LOGIN, data: AJObject.create().set("mail", _emailField.text).set("password", _passwordField.text))
    }
    
    func forgotPassword(){
        print("forgot password")
    }
}
