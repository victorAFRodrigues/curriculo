// ============================================================
//  RENDERIZAÇÃO
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Nome
  body.appendChild(el("h1", {}, CV.nome));

  // Subtítulo
  body.appendChild(el("div", { class: "subtitle" }, CV.titulo.join(" | ")));

  // Contato
  const contact = el("div", { class: "contact" });
  [
    CV.cidade,
    CV.telefone,
    CV.email,
    CV.linkedin,
    CV.github,
    `${CV.strings.availableLabel} ${CV.disponibilidade}`,
  ].forEach(txt => contact.appendChild(el("span", {}, txt)));
  body.appendChild(contact);

  // Resumo
  secao(CV.titulos.professionalSummary).forEach(n => body.appendChild(n));
  const resumoTexto = CV.resumo.replace("{anos}", CV.anosDeExperiencia);
  body.appendChild(el("p", {}, resumoTexto));

  // Marcos
  secao(CV.titulos.keyAchievements).forEach(n => body.appendChild(n));
  const ulMarcos = el("ul");
  CV.marcos.forEach(m => ulMarcos.appendChild(li(m)));
  body.appendChild(ulMarcos);

  // Experiências
  secao(CV.titulos.workExperience).forEach(n => body.appendChild(n));
  CV.experiencias.forEach(exp => {
    const duracao = exp.duracao ?? calcularDuracao(exp.inicio, exp.fim);
    const periodo = formatarPeriodo(exp.inicio, exp.fim);
    const metaParts = [exp.empresa, periodo];
    if (exp.fim !== CV.strings.present) metaParts.push(duracao);
    if (exp.local) metaParts.push(exp.local);

    body.appendChild(el("div", { class: "job-title" }, exp.cargo));
    body.appendChild(el("div", { class: "job-meta" }, metaParts.join(" \u00a0|\u00a0 ")));

    const ulBullets = el("ul");
    exp.bullets.forEach(b => ulBullets.appendChild(li(b)));
    body.appendChild(ulBullets);
  });

  // Projetos
  if (CV.projetos || CV.projects) {
    const projetosData = CV.projetos || CV.projects;
    secao(CV.titulos.projects).forEach(n => body.appendChild(n));
    projetosData.forEach(proj => {
      const nome = proj.nome || proj.name;
      body.appendChild(el("div", { class: "job-title" }, nome));
      const ulBullets = el("ul");
      proj.bullets.forEach(b => ulBullets.appendChild(li(b)));
      body.appendChild(ulBullets);
    });
  }

  // Habilidades
  secao(CV.titulos.technicalSkills).forEach(n => body.appendChild(n));
  CV.habilidades.forEach(({ categoria, itens }) => {
    const row = el("div", { class: "skills-row" });
    row.appendChild(el("strong", {}, `${categoria}:`));
    row.appendChild(document.createTextNode(" " + itens.join(", ")));
    body.appendChild(row);
  });

  // Formação
  secao(CV.titulos.education).forEach(n => body.appendChild(n));
  CV.formacao.forEach((f, i) => {
    const d = el("div", { class: "job-title" });
    if (i > 0) d.style.marginTop = "10px";
    const statusLabel = f.status ? ` (${f.status})` : "";
    d.textContent = f.curso + statusLabel;
    body.appendChild(d);
    body.appendChild(el("div", { class: "job-meta" }, `${f.instituicao} \u00a0|\u00a0 ${f.periodo}`));
  });

  // Certificações
  secao(CV.titulos.certifications).forEach(n => body.appendChild(n));
  const ulCerts = el("ul");
  CV.certificacoes.forEach(c => ulCerts.appendChild(li(c)));
  body.appendChild(ulCerts);

  // Idiomas
  secao(CV.titulos.languages).forEach(n => body.appendChild(n));
  const ulIdiomas = el("ul");
  CV.idiomas.forEach(({ idioma, nivel }) => ulIdiomas.appendChild(li(`${idioma} — ${nivel}`)));
  body.appendChild(ulIdiomas);
});
