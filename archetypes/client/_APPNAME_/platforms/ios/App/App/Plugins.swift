//
//  Plugins.swift
//  App
//
//  Created by Bruno Fortunato on 13/03/2017.
//  Copyright © 2017 Bruno Fortunato. All rights reserved.
//

import Foundation
import AJ
import ApplicaFramework

public protocol AJViewControllerDependentPlugin {
    func setViewController(_ viewController: UIViewController)
}

open class AJPluginOwnerViewController: UIViewController {
    
    private var _plugins = [AJViewControllerDependentPlugin]()
    
    open func register(plugin: String) {
        NSLog("Registered plugin \(plugin) dependency for \(self)")
        
        _plugins.append(AJ.get(plugin: plugin) as! AJViewControllerDependentPlugin)
    }
    
    open override func viewDidAppear(_ animated: Bool) {
        _plugins.forEach { $0.setViewController(self) }
        
        super.viewDidAppear(animated)
    }
    
}

@objc
open class LoaderPlugin : AJPlugin {
    
    public init() {
        super.init(name: "Loader")
    }
    
    private var _count = 0
    private var _loader = AFLoader()
    
    @objc
    public func show(_ data: AJPluginCallData) {
        if _count == 0 {
            runui {
                self._loader.show(title: data.argument.get("title")?.string, message: data.argument.get("message")?.string)
            }
        }
        
        _count += 1
    }
    
    @objc
    public func hide(_ data: AJPluginCallData) {
        if _count == 1 {
            runui {
                self._loader.hide()
            }
        }
        
        if _count > 0 {
            _count -= 1
        }
    }
    
}


@objc
open class AlertPlugin : AJPlugin, AJViewControllerDependentPlugin {
    
    struct InstanceData {
        weak var viewController: UIViewController?
        var alertController: UIAlertController?
    }
    
    public init() {
        super.init(name: "Alert")
    }
    
    private var _instances = [InstanceData]()
    private weak var _viewController: UIViewController?
    
    public func setViewController(_ viewController: UIViewController) {
        _viewController = viewController
        
        NSLog("Setted viewController \(viewController) for plugin \(self)")
    }
    
    private func getCurrentInstance() -> InstanceData? {
        if let viewController = _viewController {
            let data = _instances.first { $0.viewController == viewController }
            if data != nil {
                return data
            } else {
                let newData = InstanceData(viewController: viewController, alertController: nil)
                _instances.append(newData)
                return newData
            }
        }
        
        return nil
    }
    
    @objc
    public func alert(_ data: AJPluginCallData) {
        if var instance = getCurrentInstance() {
            instance.alertController = UIAlertController(title: data.argument.get("title")?.string, message: data.argument.get("message")?.string, preferredStyle: .alert)
            instance.alertController?.addAction(UIAlertAction(title: M("OK"), style: .cancel, handler: { (a) in
                data.callback(false, AJObject.create())
            }))
            
            runui {
                instance.viewController?.present(instance.alertController!, animated: true, completion: nil)
            }
        }
    }
    
    @objc
    public func confirm(_ data: AJPluginCallData) {
        if var instance = getCurrentInstance() {
            instance.alertController = UIAlertController(title: data.argument.get("title")?.string, message: data.argument.get("message")?.string, preferredStyle: .alert)
            instance.alertController?.addAction(UIAlertAction(title: M("Cancel"), style: .cancel, handler: { (a) in
                data.callback(true, AJObject.create())
            }))
            instance.alertController?.addAction(UIAlertAction(title: M("OK"), style: .default, handler: { (a) in
                data.callback(false, AJObject.create())
            }))
            
            runui {
                instance.viewController?.present(instance.alertController!, animated: true, completion: nil)
            }
        }
    }
    
}


@objc
open class ToastPlugin : AJPlugin {
    
    public init() {
        super.init(name: "Toast")
    }

    @objc
    public func show(_ data: AJPluginCallData) {
        runui {
            ApplicaFramework.toast(data.argument.get("message")?.string ?? "")
        }
    }
    
}
