import { mergeMeta } from "@resolid/framework/utils";
import { SpriteIcon } from "~/components/base/SpriteIcon";

export const meta = mergeMeta(() => {
  return [{ title: "关于" }];
});

export default function About() {
  return (
    <div className={"prose mx-auto max-w-3xl px-4 py-8 dark:prose-invert"}>
      <h1 className={"text-center"}>关于</h1>
      <p>
        Resolid Remix 是使用 Remix 驱动的全栈网站，旨在展示使用 Remix、React、Tailwind CSS、Vite、Drizzle
        ORM、PostgreSQL、Hono、Node.js 和 Vercel 等现代 Web 技术构建高性能、可扩展和用户友好的 Web 应用程序的最佳实践。
      </p>
      <h2>技术栈</h2>
      <div className={"flex justify-center"}>
        <div className={"inline-flex flex-wrap items-center justify-center gap-5"}>
          <SpriteIcon name={"react"} size={"3rem"} />
          <SpriteIcon name={"remix"} size={"3rem"} />
          <SpriteIcon name={"tailwindcss"} size={"3rem"} />
          <SpriteIcon name={"typescript"} size={"3rem"} />
          <SpriteIcon name={"vite"} size={"3rem"} />
          <SpriteIcon name={"nodejs"} size={"3rem"} />
          <SpriteIcon name={"drizzle-orm"} size={"3rem"} />
          <SpriteIcon name={"postgresql"} size={"3rem"} />
          <SpriteIcon name={"hono"} size={"3rem"} />
          <SpriteIcon name={"vercel"} size={"3rem"} />
        </div>
      </div>
      <h3>React</h3>
      <p>
        React 可以改变你对所查看的设计和构建的应用的思考方式。当你使用 React
        构建用户界面时，首先会将其分解为称为组件的部分。接下来，你将描述每个组件的不同视觉状态。最后，你将连接这些组件，使数据通过它们流动。
      </p>
      <h3>Remix</h3>
      <p>
        Remix 是一个全栈网络框架，它允许你专注于用户界面，并通过 Web
        标准逆向工作，以提供快速、流畅且弹性的用户体验。使用你的工具的人们将会喜欢它。
      </p>
      <h3>Tailwind CSS</h3>
      <p>
        Tailwind CSS 的工作方式是通过扫描所有的 HTML 文件、JavaScript
        组件和其他模板中的类名，生成相应的样式，然后将它们写入一个静态的 CSS 文件。
      </p>
      <p>它速度快、灵活且可靠，且零运行时。</p>
      <h3>Vite</h3>
      <p>
        Vite 是一种具有明确建议的工具，具备合理的默认设置。您可以在 功能指南 中了解 Vite 的各种可能性。通过 插件，Vite
        支持与其他框架或工具的集成。如有需要，您可以通过 配置部分 自定义适应你的项目。
      </p>
      <p>Vite 还提供了强大的扩展性，可通过其 插件 API 和 JavaScript API 进行扩展，并提供完整的类型支持。</p>
      <h3>Drizzle ORM</h3>
      <p>
        Drizzle ORM 是一个带有头部🐲的无头 TypeScript ORM。
        它看起来简单而直观，能够在项目的第1000天保持高性能，允许你按照自己的方式进行操作，并在需要时提供支持。
      </p>
      <h3>PostgreSQL</h3>
      <p>
        PostgreSQL 是一个功能强大的开源对象关系数据库系统，经过超过 35
        年的积极开发，在可靠性、功能稳健性和性能方面赢得了良好的声誉。
      </p>
      <h3>Hono</h3>
      <p>
        Hono - [炎] 在日语中表示火焰🔥，是一个面向 Edge 的小型、简单且超快速的 Web 框架。它适用于任何 JavaScript
        运行时环境：Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge 和 Node.js。
      </p>
      <h3>Node.js</h3>
      <p>
        Node.js 是一个开源且跨平台的 JavaScript 运行环境。它是几乎任何类型项目的热门工具！ Node.js 运行的是 V8
        JavaScript 引擎，这是 Google Chrome 浏览器的核心，但在浏览器之外运行。这使得 Node.js 具有很高的性能。
      </p>
      <h3>Vercel</h3>
      <p>Vercel 的前端云为开发人员提供构建、扩展和保护更快、更个性化 Web 的体验和基础设施。</p>
      <h3>Neon</h3>
      <p>完全托管的无服务器 Postgres，具有慷慨的免费套餐。我们将存储和计算分开，以提供自动扩展、分支和无底存储。</p>
    </div>
  );
}
