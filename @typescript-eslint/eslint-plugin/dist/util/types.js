"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsutils_1 = require("tsutils");
const ts = __importStar(require("typescript"));
/**
 * @param type Type being checked by name.
 * @param allowedNames Symbol names checking on the type.
 * @returns Whether the type is, extends, or contains all of the allowed names.
 */
function containsAllTypesByName(type, allowAny, allowedNames) {
    if (isTypeFlagSet(type, ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
        return !allowAny;
    }
    if (tsutils_1.isTypeReference(type)) {
        type = type.target;
    }
    if (typeof type.symbol !== 'undefined' &&
        allowedNames.has(type.symbol.name)) {
        return true;
    }
    if (tsutils_1.isUnionOrIntersectionType(type)) {
        return type.types.every(t => containsAllTypesByName(t, allowAny, allowedNames));
    }
    const bases = type.getBaseTypes();
    return (typeof bases !== 'undefined' &&
        bases.length > 0 &&
        bases.every(t => containsAllTypesByName(t, allowAny, allowedNames)));
}
exports.containsAllTypesByName = containsAllTypesByName;
/**
 * Get the type name of a given type.
 * @param typeChecker The context sensitive TypeScript TypeChecker.
 * @param type The type to get the name of.
 */
function getTypeName(typeChecker, type) {
    // It handles `string` and string literal types as string.
    if ((type.flags & ts.TypeFlags.StringLike) !== 0) {
        return 'string';
    }
    // If the type is a type parameter which extends primitive string types,
    // but it was not recognized as a string like. So check the constraint
    // type of the type parameter.
    if ((type.flags & ts.TypeFlags.TypeParameter) !== 0) {
        // `type.getConstraint()` method doesn't return the constraint type of
        // the type parameter for some reason. So this gets the constraint type
        // via AST.
        const node = type.symbol.declarations[0];
        if (node.constraint != null) {
            return getTypeName(typeChecker, typeChecker.getTypeFromTypeNode(node.constraint));
        }
    }
    // If the type is a union and all types in the union are string like,
    // return `string`. For example:
    // - `"a" | "b"` is string.
    // - `string | string[]` is not string.
    if (type.isUnion() &&
        type.types
            .map(value => getTypeName(typeChecker, value))
            .every(t => t === 'string')) {
        return 'string';
    }
    // If the type is an intersection and a type in the intersection is string
    // like, return `string`. For example: `string & {__htmlEscaped: void}`
    if (type.isIntersection() &&
        type.types
            .map(value => getTypeName(typeChecker, value))
            .some(t => t === 'string')) {
        return 'string';
    }
    return typeChecker.typeToString(type);
}
exports.getTypeName = getTypeName;
/**
 * Resolves the given node's type. Will resolve to the type's generic constraint, if it has one.
 */
function getConstrainedTypeAtLocation(checker, node) {
    const nodeType = checker.getTypeAtLocation(node);
    const constrained = checker.getBaseConstraintOfType(nodeType);
    return constrained !== null && constrained !== void 0 ? constrained : nodeType;
}
exports.getConstrainedTypeAtLocation = getConstrainedTypeAtLocation;
/**
 * Checks if the given type is (or accepts) nullable
 * @param isReceiver true if the type is a receiving type (i.e. the type of a called function's parameter)
 */
function isNullableType(type, { isReceiver = false, allowUndefined = true, } = {}) {
    const flags = getTypeFlags(type);
    if (isReceiver && flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
        return true;
    }
    if (allowUndefined) {
        return (flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) !== 0;
    }
    else {
        return (flags & ts.TypeFlags.Null) !== 0;
    }
}
exports.isNullableType = isNullableType;
/**
 * Gets the declaration for the given variable
 */
function getDeclaration(checker, node) {
    const symbol = checker.getSymbolAtLocation(node);
    if (!symbol) {
        return null;
    }
    const declarations = symbol.declarations;
    if (!declarations) {
        return null;
    }
    return declarations[0];
}
exports.getDeclaration = getDeclaration;
/**
 * Gets all of the type flags in a type, iterating through unions automatically
 */
function getTypeFlags(type) {
    let flags = 0;
    for (const t of tsutils_1.unionTypeParts(type)) {
        flags |= t.flags;
    }
    return flags;
}
exports.getTypeFlags = getTypeFlags;
/**
 * Checks if the given type is (or accepts) the given flags
 * @param isReceiver true if the type is a receiving type (i.e. the type of a called function's parameter)
 */
function isTypeFlagSet(type, flagsToCheck, isReceiver) {
    const flags = getTypeFlags(type);
    if (isReceiver && flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
        return true;
    }
    return (flags & flagsToCheck) !== 0;
}
exports.isTypeFlagSet = isTypeFlagSet;
/**
 * @returns Whether a type is an instance of the parent type, including for the parent's base types.
 */
function typeIsOrHasBaseType(type, parentType) {
    if (type.symbol === undefined || parentType.symbol === undefined) {
        return false;
    }
    const typeAndBaseTypes = [type];
    const ancestorTypes = type.getBaseTypes();
    if (ancestorTypes !== undefined) {
        typeAndBaseTypes.push(...ancestorTypes);
    }
    for (const baseType of typeAndBaseTypes) {
        if (baseType.symbol !== undefined &&
            baseType.symbol.name === parentType.symbol.name) {
            return true;
        }
    }
    return false;
}
exports.typeIsOrHasBaseType = typeIsOrHasBaseType;
/**
 * Gets the source file for a given node
 */
function getSourceFileOfNode(node) {
    while (node && node.kind !== ts.SyntaxKind.SourceFile) {
        node = node.parent;
    }
    return node;
}
exports.getSourceFileOfNode = getSourceFileOfNode;
function getTokenAtPosition(sourceFile, position) {
    const queue = [sourceFile];
    let current;
    while (queue.length > 0) {
        current = queue.shift();
        // find the child that contains 'position'
        for (const child of current.getChildren(sourceFile)) {
            const start = child.getFullStart();
            if (start > position) {
                // If this child begins after position, then all subsequent children will as well.
                return current;
            }
            const end = child.getEnd();
            if (position < end ||
                (position === end && child.kind === ts.SyntaxKind.EndOfFileToken)) {
                queue.push(child);
                break;
            }
        }
    }
    return current;
}
exports.getTokenAtPosition = getTokenAtPosition;
function getEqualsKind(operator) {
    switch (operator) {
        case '==':
            return {
                isPositive: true,
                isStrict: false,
            };
        case '===':
            return {
                isPositive: true,
                isStrict: true,
            };
        case '!=':
            return {
                isPositive: false,
                isStrict: false,
            };
        case '!==':
            return {
                isPositive: true,
                isStrict: true,
            };
        default:
            return undefined;
    }
}
exports.getEqualsKind = getEqualsKind;
/**
 * @returns true if the type is `any`
 */
function isTypeAnyType(type) {
    return isTypeFlagSet(type, ts.TypeFlags.Any);
}
exports.isTypeAnyType = isTypeAnyType;
/**
 * @returns `AnyType.Any` if the type is `any`, `AnyType.AnyArray` if the type is `any[]` or `readonly any[]`,
 *          otherwise it returns `AnyType.Safe`.
 */
function isAnyOrAnyArrayTypeDiscriminated(node, checker) {
    const type = checker.getTypeAtLocation(node);
    if (isTypeAnyType(type)) {
        return 0 /* Any */;
    }
    if (checker.isArrayType(type) &&
        isTypeAnyType(checker.getTypeArguments(type)[0])) {
        return 1 /* AnyArray */;
    }
    return 2 /* Safe */;
}
exports.isAnyOrAnyArrayTypeDiscriminated = isAnyOrAnyArrayTypeDiscriminated;
/**
 * Does a simple check to see if there is an any being assigned to a non-any type.
 *
 * This also checks generic positions to ensure there's no unsafe sub-assignments.
 * Note: in the case of generic positions, it makes the assumption that the two types are the same.
 *
 * @example See tests for examples
 *
 * @returns false if it's safe, or an object with the two types if it's unsafe
 */
function isUnsafeAssignment(type, receiver, checker) {
    var _a, _b;
    if (tsutils_1.isTypeReference(type) && tsutils_1.isTypeReference(receiver)) {
        // TODO - figure out how to handle cases like this,
        // where the types are assignable, but not the same type
        /*
        function foo(): ReadonlySet<number> { return new Set<any>(); }
    
        // and
    
        type Test<T> = { prop: T }
        type Test2 = { prop: string }
        declare const a: Test<any>;
        const b: Test2 = a;
        */
        if (type.target !== receiver.target) {
            // if the type references are different, assume safe, as we won't know how to compare the two types
            // the generic positions might not be equivalent for both types
            return false;
        }
        const typeArguments = (_a = type.typeArguments) !== null && _a !== void 0 ? _a : [];
        const receiverTypeArguments = (_b = receiver.typeArguments) !== null && _b !== void 0 ? _b : [];
        for (let i = 0; i < typeArguments.length; i += 1) {
            const arg = typeArguments[i];
            const receiverArg = receiverTypeArguments[i];
            const unsafe = isUnsafeAssignment(arg, receiverArg, checker);
            if (unsafe) {
                return { sender: type, receiver };
            }
        }
        return false;
    }
    if (isTypeAnyType(type) && !isTypeAnyType(receiver)) {
        return { sender: type, receiver };
    }
    return false;
}
exports.isUnsafeAssignment = isUnsafeAssignment;
/**
 * Returns the contextual type of a given node.
 * Contextual type is the type of the target the node is going into.
 * i.e. the type of a called function's parameter, or the defined type of a variable declaration
 */
function getContextualType(checker, node) {
    const parent = node.parent;
    if (!parent) {
        return;
    }
    if (tsutils_1.isCallExpression(parent) || tsutils_1.isNewExpression(parent)) {
        if (node === parent.expression) {
            // is the callee, so has no contextual type
            return;
        }
    }
    else if (tsutils_1.isVariableDeclaration(parent) ||
        tsutils_1.isPropertyDeclaration(parent) ||
        tsutils_1.isParameterDeclaration(parent)) {
        return parent.type ? checker.getTypeFromTypeNode(parent.type) : undefined;
    }
    else if (tsutils_1.isJsxExpression(parent)) {
        return checker.getContextualType(parent);
    }
    else if (![ts.SyntaxKind.TemplateSpan, ts.SyntaxKind.JsxExpression].includes(parent.kind)) {
        // parent is not something we know we can get the contextual type of
        return;
    }
    // TODO - support return statement checking
    return checker.getContextualType(node);
}
exports.getContextualType = getContextualType;
//# sourceMappingURL=types.js.map