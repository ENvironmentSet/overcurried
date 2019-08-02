---
title: Hello world
date: 2019-08-01
description: Simple introduction of oversomething
somethings: 1
---

# over-？

![current version](https://img.shields.io/github/package-json/v/ENvironmentSet/oversomething)

oversomething is modernized Gatsby starter blog.
design and some features are came from [gatsby stater blog](https://github.com/gatsbyjs/gatsby-starter-blog) and [overreacted](https://overreacted.io)

## Why oversomething?

- 🕹️ Simple : What you need is just a blog, not a redundant web site
- 🤩 Easy : You can easily configure your blog
- 🛠️ Extendable : You can add features by writing some code over modernized codebase

## Features
Features have three kinds of state:
- Available(✅): Feature is fully implemented
- WIP(🚧): Feature is partially implemented
- Todo(📝): Feature is not implemented yet

| Feature | Current State |
|---------|---------------|
| Writing Post with Markdown | ✅ |
| Blog name, Bio and Contact | ✅ |
| SEO(Search Engine Optimization) | ✅ |
| GA(Google Analytics) Support | ✅ |
| Theme customization | 🚧 |
| Writing Post with other format(JSX/MDX) | 📝 |
| i18n support | 📝 |
| Categorizing/Searching post | 📝 |
| RSS | 📝 |
| CLI for blogging | 📝 |

### Writing Post with Markdown
since markdown is very effective format to write an post, oversomething uses it as default post format.

1. Create your post's directory inside `/content/blog`
2. Put your post and it's assets inside your post's directory

for example:
```
/content
  /blog
    /your-post <-- post's directory
      /index.md <-- acutal post
      /someImage.png <-- post's asset
```

#### Basic post form

```

---
title: {title}
date: {YYYY-MM-DD}
description: {description}
somethings: {amount of something}
---
{Content}

```

### Customization
You can config blog through:

- a `oversomething` property in `package.json`
- a `.oversomethingrc` file in JSON or YAML format
- a `.oversomethingrc.json` file
- a `.oversomethingrc.yaml`, `.oversomethingrc.yml`, or `.oversomethingrc.js` file
- a `oversomething.config.js` file exporting a JS object

#### Configuration format

```
{
  siteMetadata: {
        title: {blog title},
        author: {blog author},
        description: {author/blog description},
        siteUrl: {uri of blog},
        social: {
          github: {blog author's github profile},
          twitter: {blog author's twitter profile}
        },
        something: {emoji that represents level of difficulty of post},
        theme: {name of built-in theme}
      },
      useIcon: false // flag for favicon. if you turn on this, place favicon in content/assets/icon.ico.
  }
}
```

#### Available built-in themes

You can check detailed information include color scheme in [here](https://www.material-theme.com/docs/reference/color-palette/)

##### Material Themes

- Oceanic as `oceanic`
- Darker as `darker`
- Lighter as `lighter`
- Palenight as `palenight`
- Deep Ocean as `deepOcean`

##### Other themes

- Monikai Pro as `monokaiPro`
- Dracula as `dracula`
- Github as `github`
- Arc Dark as `arcDark`
- One Dark as `oneDark`
- One Light as `oneLight`
- Solarized Dark as `solarizedDark`
- Solarized Light as `solarizedLight`
