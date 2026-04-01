export function interpolateTemplate(
  template: any[],
  paramDefs: { name: string; required?: boolean; default?: any }[],
  blockUsage: any
): any[] {
  // Build resolved params from defaults + provided values
  const params: Record<string, any> = {};
  for (const p of paramDefs) {
    params[p.name] = blockUsage[p.name] ?? p.default ?? null;
  }
  return template.map(el => interpolateElement(JSON.parse(JSON.stringify(el)), params)).filter(Boolean);
}

function interpolateElement(el: any, params: Record<string, any>): any | null {
  // Handle if: "{{param}}" - remove element if param is falsy
  if (el.if) {
    const paramName = extractParamName(el.if);
    if (paramName && !params[paramName]) return null;
    delete el.if;
  }

  // Recursively interpolate all string values
  for (const key of Object.keys(el)) {
    if (typeof el[key] === 'string') {
      el[key] = interpolateString(el[key], params);
    } else if (Array.isArray(el[key])) {
      el[key] = el[key].map((child: any) => {
        if (typeof child === 'object') return interpolateElement(child, params);
        if (typeof child === 'string') return interpolateString(child, params);
        return child;
      }).filter(Boolean);
    } else if (typeof el[key] === 'object' && el[key] !== null) {
      el[key] = interpolateElement(el[key], params);
    }
  }
  return el;
}

function extractParamName(str: string): string | null {
  const match = str.match(/^\{\{(\w[\w-]*)\}\}$/);
  return match ? match[1] : null;
}

function interpolateString(str: string, params: Record<string, any>): string {
  // Handle ternary: {{param == 'value' ? 'a' : 'b'}}
  // Handle simple: {{param}}
  return str.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    expr = expr.trim();
    // Check for ternary
    const ternaryMatch = expr.match(/^(\w[\w-]*)\s*==\s*'([^']*)'\s*\?\s*'([^']*)'\s*:\s*(.+)$/);
    if (ternaryMatch) {
      const [, paramName, compareValue, trueResult, falseExpr] = ternaryMatch;
      if (String(params[paramName]) === compareValue) return trueResult;
      // falseExpr might be another ternary or a simple 'value'
      const simpleMatch = falseExpr.match(/^'([^']*)'$/);
      if (simpleMatch) return simpleMatch[1];
      // Nested ternary - recursively evaluate
      return interpolateString(`{{${falseExpr}}}`, params);
    }
    // Simple param reference
    return params[expr] !== undefined && params[expr] !== null ? String(params[expr]) : '';
  });
}
