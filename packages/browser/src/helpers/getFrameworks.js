const existsAndIsNotANode = property => !!self[property] && !(self[property] instanceof Node)

const makeBaseDetection = framework => () => existsAndIsNotANode(framework)

const detectors = {
  react: () => {
    if (existsAndIsNotANode(self.React)) return true
    if (document.querySelector('[data-reactroot], [data-reactid]')) return true

    if (
      Array.from(document.querySelectorAll('body > div')).some(elem =>
        elem.hasOwnProperty('_reactRootContainer')
      )
    )
      return true
    return false
  },
  nextJs: () => !!document.querySelector('script[id=__NEXT_DATA__]'),
  gatsby: () => !!document.querySelector('[id=___gatsby]'),
  angularJs: () => {
    if (existsAndIsNotANode(self.angular)) return true
    if (
      document.querySelector(
        '.ng-binding, [ng-app], [data-ng-app], [ng-controller], [data-ng-controller], [ng-repeat], [data-ng-repeat]'
      )
    )
      return true
    if (document.querySelector('script[src*="angular.js"], script[src*="angular.min.js"]'))
      return true
    return false
  },
  angular: () => !!window.getAllAngularRootElements || !!window.ng?.coreTokens?.NgZone,
  backbone: makeBaseDetection('Backbone'),
  ember: makeBaseDetection('Ember'),
  vue: makeBaseDetection('Vue'),
  meteor: makeBaseDetection('Meteor'),
  zepto: makeBaseDetection('Zepto'),
  jquery: makeBaseDetection('jQuery'),
}

export default () => {
  const frameworks = Object.keys(detectors)
    .map(framework => detectors[framework]() && framework)
    .filter(Boolean)

  return frameworks
}
