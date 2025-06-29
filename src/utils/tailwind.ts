// just for type hints
export function tw(template: TemplateStringsArray, ...values: unknown[]): string {
    const result = Array<string>(template.length + values.length);

    result[0] = template[0];

    for (let i = 1; i < template.length; i++) {
        const k = i * 2;
        result[k - 1] = `${values[i - 1]}`;
        result[k] = template[i];
    }

    return result.join("");
}
