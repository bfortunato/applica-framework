//
//  HomeViewController.swift
//  App
//
//  Created by Bruno Fortunato on 13/03/2017.
//  Copyright © 2017 Bruno Fortunato. All rights reserved.
//

import Foundation
import UIKit
import ApplicaFramework

class HomeViewController: UIViewController {
    
    override func loadView() {
        super.loadView()
        
        Theme.apply(style: .mainViewInverse, to: view)
        
        let label = UILabel()
        label.text = "Hello World"
        Theme.apply(style: .textTitle1Inverse, to: label)
        label.sizeToFit()
        label.frame = RB.withParent(view.frame).sameAs(label.frame).vcenter().center().make()
        
        view.addSubview(label)
    }
    
}
