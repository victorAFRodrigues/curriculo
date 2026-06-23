async function exportDocx() {
    const status = document.getElementById('popup-status');
    status.className = 'popup-status';
    status.textContent = CV.strings.generatingDocx;

    try {
        const {
            Document, Packer, Paragraph, TextRun, AlignmentType,
            BorderStyle, LevelFormat, HeadingLevel
        } = docx;

        // helpers
        const BLUE = "1565C0", DARK = "0F1923", GRAY = "546E7A";
        const font = "Arial";

        const t  = (text, opts = {}) => new TextRun({ text, font, size: 22, color: DARK, ...opts });
        const tb = (text, opts = {}) => t(text, { bold: true, ...opts });

        const p  = (...runs) => new Paragraph({ children: runs, spacing: { after: 60 } });
        const ph1 = (text)   => new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 40 },
            children: [new TextRun({ text, font, size: 40, bold: true, color: DARK })]
        });
        const pSub = (text) => new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text, font, size: 22, color: GRAY })]
        });
        const pContact = (text) => new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text, font, size: 20, color: GRAY })]
        });
        const pSection = (text) => new Paragraph({
            spacing: { before: 280, after: 80 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 4 } },
            children: [new TextRun({ text: text.toUpperCase(), font, size: 20, bold: true, color: BLUE })]
        });
        const pJobTitle = (text) => new Paragraph({
            spacing: { before: 180, after: 20 },
            children: [new TextRun({ text, font, size: 22, bold: true, color: DARK })]
        });
        const pJobMeta = (text) => new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text, font, size: 20, color: GRAY })]
        });
        const pBullet = (text) => new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            spacing: { before: 40, after: 40 },
            children: [new TextRun({ text, font, size: 20, color: DARK })]
        });
        const pSkill = (cat, itens) => new Paragraph({
            spacing: { after: 60 },
            children: [
                new TextRun({ text: cat + ": ", font, size: 20, bold: true, color: DARK }),
                new TextRun({ text: itens.join(", "), font, size: 20, color: DARK }),
            ]
        });

        // Build content
        const children = [];

        // Header
        children.push(ph1(CV.nome));
        children.push(pSub(CV.titulo.join(" | ")));
        children.push(pContact([CV.cidade, CV.telefone, CV.email, CV.linkedin, CV.github, `${CV.strings.availableLabel} ${CV.disponibilidade}`].join("   |   ")));

        // Resumo
        children.push(pSection(CV.titulos.professionalSummary));
        children.push(p(t(CV.resumo.replace("{anos}", CV.anosDeExperiencia))));

        // Marcos
        children.push(pSection(CV.titulos.keyAchievements));
        CV.marcos.forEach(m => children.push(pBullet(m)));

        // Experiência
        children.push(pSection(CV.titulos.workExperience));
        CV.experiencias.forEach(exp => {
            const duracao = exp.duracao ?? calcularDuracao(exp.inicio, exp.fim);
            const periodo = formatarPeriodo(exp.inicio, exp.fim);
            const metaParts = [exp.empresa, periodo];
            if (exp.fim !== CV.strings.present) metaParts.push(duracao);
            if (exp.local) metaParts.push(exp.local);

            children.push(pJobTitle(exp.cargo));
            children.push(pJobMeta(metaParts.join("   |   ")));
            exp.bullets.forEach(b => children.push(pBullet(b)));
        });

        // Projects
        const projetosData = CV.projetos || CV.projects;
        if (projetosData) {
          children.push(pSection(CV.titulos.projects));
          projetosData.forEach(proj => {
            const nome = proj.nome || proj.name;
            children.push(pJobTitle(nome));
            proj.bullets.forEach(b => children.push(pBullet(b)));
          });
        }

        // Habilidades
        children.push(pSection(CV.titulos.technicalSkills));
        CV.habilidades.forEach(({ categoria, itens }) => children.push(pSkill(categoria, itens)));

        // Formação
        children.push(pSection(CV.titulos.education));
        CV.formacao.forEach(f => {
            const statusLabel = f.status ? ` (${f.status})` : "";
            children.push(pJobTitle(f.curso + statusLabel));
            children.push(pJobMeta(`${f.instituicao}   |   ${f.periodo}`));
        });

        // Certificações
        children.push(pSection(CV.titulos.certifications));
        CV.certificacoes.forEach(c => children.push(pBullet(c)));

        // Idiomas
        children.push(pSection(CV.titulos.languages));
        CV.idiomas.forEach(({ idioma, nivel }) => children.push(pBullet(`${idioma} — ${nivel}`)));

        const doc = new Document({
            numbering: {
                config: [{
                    reference: "bullets",
                    levels: [{
                        level: 0, format: LevelFormat.BULLET, text: "-",
                        alignment: AlignmentType.LEFT,
                        style: { paragraph: { indent: { left: 400, hanging: 200 } } }
                    }]
                }]
            },
            sections: [{
                properties: {
                    page: { margin: { top: 900, right: 1080, bottom: 900, left: 1080 } }
                },
                children
            }]
        });

        const blob = await Packer.toBlob(doc);
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        const nome = CV.nome.toLowerCase().replace(/\s+/g, "_");
        a.href = url; a.download = `curriculo_${nome}.docx`;
        a.click();
        URL.revokeObjectURL(url);

        status.textContent = CV.strings.downloadStarted;
        setTimeout(() => { status.textContent = ""; }, 3000);

    } catch (err) {
        console.error(err);
        status.className = "popup-status error";
        status.textContent = CV.strings.docxError;
    }
}
