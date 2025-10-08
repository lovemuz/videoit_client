//
//  Data+hexenc.swift
//  nmoment
//
//  Created on 2/5/25.
//

import Foundation

public extension Data {
    public func hexEncodedString() -> String {
        return map { String(format: "%02hhx", $0) }.joined()
    }
}
