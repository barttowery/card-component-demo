export function addStyle(shadow: ShadowRoot, styles: string[]) {
  const css = styles.join('\n').replace(/:root/g, ':host');

  // Extract @property declarations and hoist to document head,
  // because @property doesn't work inside Shadow DOM <style> elements.
  // https://github.com/tailwindlabs/tailwindcss/issues/15005
  const propertyRules: string[] = [];
  const shadowCss = css.replace(/@property\s+[^{]+\{[^}]*\}/g, (match) => {
    propertyRules.push(match);
    return '';
  });

  if (
    propertyRules.length > 0 &&
    !document.head.querySelector('style[data-cmp-property-rules]')
  ) {
    const propStyle = document.createElement('style');
    propStyle.setAttribute('data-cmp-property-rules', '');
    propStyle.textContent = propertyRules.join('\n');
    document.head.appendChild(propStyle);
  }

  const style = document.createElement('style');
  style.textContent = shadowCss;
  if (shadow.firstChild) {
    shadow.insertBefore(style, shadow.firstChild);
  } else {
    shadow.appendChild(style);
  }
}

export function addFonts() {
  if (document.head.querySelector('link[href*="fonts.googleapis.com/css2"]')) {
    return;
  }
  const preconnectLink = document.createElement('link');
  preconnectLink.rel = 'preconnect';
  preconnectLink.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnectLink);
  const preconnectGstaticLink = document.createElement('link');
  preconnectGstaticLink.rel = 'preconnect';
  preconnectGstaticLink.href = 'https://fonts.gstatic.com';
  preconnectGstaticLink.crossOrigin = 'anonymous';
  document.head.appendChild(preconnectGstaticLink);
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.onload = () => {
    link.rel = 'stylesheet';
  };
  link.href =
    'https://fonts.googleapis.com/css2?family=Inter&family=Geist:wght@100..900&display=swap';
  document.head.appendChild(link);
}
