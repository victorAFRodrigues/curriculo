// ============================================================
//  funções utilitárias do currículo
// ============================================================

function calcularDuracao(inicio, fim, strings = CV.strings) {
    const [mi, ai] = inicio.split("/").map(Number);
    let meses;
    if (fim === strings.present) {
        const hoje = new Date();
        meses = (hoje.getFullYear() - ai) * 12 + (hoje.getMonth() + 1 - mi);
    } else {
        const [mf, af] = fim.split("/").map(Number);
        meses = (af - ai) * 12 + (mf - mi);
    }
    const anos  = Math.floor(meses / 12);
    const resto = meses % 12;
    const partes = [];
    if (anos  > 0) partes.push(`${anos} ${anos  === 1 ? strings.year  : strings.years}`);
    if (resto > 0) partes.push(`${resto} ${resto === 1 ? strings.month : strings.monthsUnit}`);
    return partes.join(strings.and) || strings.lessThanOneMonth;
}

function formatarPeriodo(inicio, fim, strings = CV.strings) {
    const meses = strings.months;
    function fmt(str) {
        if (str === strings.present) return strings.present;
        const [m, a] = str.split("/");
        return `${meses[parseInt(m) - 1].charAt(0).toUpperCase() + meses[parseInt(m) - 1].slice(1)}${strings.of}${a}`;
    }
    return `${fmt(inicio)} – ${fmt(fim)}`;
}

function el(tag, attrs = {}, ...children) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    for (const c of children) {
        if (typeof c === "string") e.appendChild(document.createTextNode(c));
        else if (c) e.appendChild(c);
    }
    return e;
}

function hr() { return document.createElement("hr"); }

function secao(titulo) {
    return [el("h2", {}, titulo), hr()];
}

function li(texto) {
    const item = document.createElement("li");
    item.textContent = texto;
    return item;
}