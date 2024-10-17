import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';

export default defineNuxtPlugin(() => {
    const md = new MarkdownIt()
        .use(markdownItContainer, 'code-group', {
            validate: function(params) {
                return params.trim().match(/^code-group\s+(.*)$/);
            },
            render: function (tokens, idx) {
                if (tokens[idx].nesting === 1) {
                    return '<div class="code-group">\n';
                } else {
                    return '</div>\n';
                }
            }
        })
        .use(markdownItContainer, 'bash', {
            validate: function(params) {
                return params.trim().match(/^bash\s+(.*)$/);
            },
            render: function (tokens, idx) {
                const m = tokens[idx].info.trim().match(/^bash\s+(.*)$/);

                if (tokens[idx].nesting === 1) {
                    const language = m[1];
                    return `<div class="code-block"><div class="language">${language}</div><pre><code>`;
                } else {
                    return `</code></pre></div>\n`;
                }
            }
        });

    return {
        provide: {
            md
        }
    };
});
