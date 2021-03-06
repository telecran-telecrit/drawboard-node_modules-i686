"use strict";

exports.__esModule = true;
exports.default = getRole;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// https://w3c.github.io/html-aria/#document-conformance-requirements-for-use-of-aria-attributes-in-html
function getRole(element) {
  var explicitRole = getExplicitRole(element);

  if (explicitRole !== null) {
    return explicitRole;
  }

  return getImplicitRole(element);
}

var tagToRoleMappings = {
  ARTICLE: "article",
  ASIDE: "complementary",
  BODY: "document",
  BUTTON: "button",
  DATALIST: "listbox",
  DD: "definition",
  DETAILS: "group",
  DIALOG: "dialog",
  DT: "term",
  FIELDSET: "group",
  FIGURE: "figure",
  // WARNING: Only with an accessible name
  FORM: "form",
  FOOTER: "contentinfo",
  H1: "heading",
  H2: "heading",
  H3: "heading",
  H4: "heading",
  H5: "heading",
  H6: "heading",
  HEADER: "banner",
  HR: "separator",
  LEGEND: "legend",
  LI: "listitem",
  MATH: "math",
  MAIN: "main",
  MENU: "list",
  NAV: "navigation",
  OL: "list",
  OPTGROUP: "group",
  // WARNING: Only in certain context
  OPTION: "option",
  OUTPUT: "status",
  PROGRESS: "progressbar",
  // WARNING: Only with an accessible name
  SECTION: "region",
  SUMMARY: "button",
  TABLE: "table",
  TBODY: "rowgroup",
  TEXTAREA: "textbox",
  TFOOT: "rowgroup",
  // WARNING: Only in certain context
  TD: "cell",
  TH: "columnheader",
  THEAD: "rowgroup",
  TR: "row",
  UL: "list"
};

function getImplicitRole(element) {
  var mappedByTag = tagToRoleMappings[element.tagName];

  if (mappedByTag !== undefined) {
    return mappedByTag;
  }

  switch (element.tagName) {
    case "A":
    case "AREA":
    case "LINK":
      if (element.hasAttribute("href")) {
        return "link";
      }

      break;

    case "IMG":
      if ((element.getAttribute("alt") || "").length > 0) {
        return "img";
      }

      break;

    case "INPUT":
      {
        var _ref = element,
            type = _ref.type;

        switch (type) {
          case "button":
          case "image":
          case "reset":
          case "submit":
            return "button";

          case "checkbox":
          case "radio":
            return type;

          case "range":
            return "slider";

          case "email":
          case "tel":
          case "text":
          case "url":
            if (element.hasAttribute("list")) {
              return "combobox";
            }

            return "textbox";

          case "search":
            if (element.hasAttribute("list")) {
              return "combobox";
            }

            return "searchbox";

          default:
            return null;
        }
      }

    case "SELECT":
      if (element.hasAttribute("multiple") || element.size > 1) {
        return "listbox";
      }

      return "combobox";
  }

  return null;
}

function getExplicitRole(element) {
  if (element.hasAttribute("role")) {
    // safe due to hasAttribute check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var _trim$split = element.getAttribute("role").trim().split(" "),
        _trim$split2 = _slicedToArray(_trim$split, 1),
        explicitRole = _trim$split2[0];

    if (explicitRole !== undefined && explicitRole.length > 0) {
      return explicitRole;
    }
  }

  return null;
}
//# sourceMappingURL=getRole.js.map