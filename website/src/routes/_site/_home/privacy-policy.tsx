import { mergeMeta } from "@resolid/framework/utils";

export const meta = mergeMeta(() => {
  return [{ title: "隐私政策" }];
});

export default function PrivacyPolicy() {
  return (
    <div className={"prose dark:prose-invert mx-auto max-w-3xl px-4 py-8"}>
      <h1 className={"text-center"}>隐私政策</h1>
      <p>最后更新时间：2024 年 04 月 16 日</p>
      <p>Resolid Tech（“我们”、“我们”或“我们的”）运营 Resolid 网站（“服务”）。</p>
      <p>我们使用您的个人数据来提供和改进服务。使用服务即表示您同意根据本隐私政策收集和使用信息。</p>
      <p>本页告知您我们在您使用我们的服务时收集、使用和披露个人信息的政策。</p>
      <p>除本隐私政策所述之外，我们不会使用或与任何人共享您的信息。</p>
      <p>
        我们使用您的个人信息来提供和改进服务。使用服务即表示您同意根据本政策收集和使用信息。除非本隐私政策中另有定义，本隐私政策中使用的术语与我们的条款和条件具有相同的含义，可通过
        <a href={"terms-service"}>服务协议</a>访问
      </p>
      <h2>信息收集与使用</h2>
      <p>
        在使用我们的服务时，我们可能会要求您向我们提供某些可用于联系或识别您的个人身份信息。个人身份信息（“个人信息”）可能包括但不限于：
      </p>
      <ol>
        <li>在我们的网站上注册时填写的信息，例如电子邮箱地址和用户名；</li>
        <li>
          在我们的网站上创建个人资料时填写的信息，例如姓名、个人资料图片、性别、生日、人际关系状况、兴趣和爱好、教育背景和工作信息；
        </li>
        <li>在我们网站上发布的、意图发布到互联网上的信息，其中包括你的用户名、个人资料图片以及你发布的内容；</li>
      </ol>
      <h2>日志数据</h2>
      <p>
        每当您访问我们的服务时，我们都会收集您的浏览器发送的信息（“日志数据”）。该日志数据可能包括您计算机的互联网协议（“IP”）地址、浏览器类型、浏览器版本、您访问的我们服务的页面、您访问的时间和日期、在这些页面上花费的时间以及其他信息和统计数据。
      </p>
      <h2>Cookies</h2>
      <p>
        Cookie 是包含少量数据的文件，其中可能包含匿名唯一标识符。 Cookie
        从网站发送到您的浏览器并存储在您计算机的硬盘上。
      </p>
      <p>
        我们使用 “Cookies” 来收集信息。您可以指示您的浏览器拒绝所有 Cookie 或在发送 Cookie
        时进行指示。但是，如果您不接受 Cookie，您可能无法使用我们服务的某些部分。
      </p>
      <h2>服务供应商</h2>
      <p>
        我们可能会雇用第三方公司和个人来促进我们的服务、代表我们提供服务、执行与服务相关的服务或协助我们分析我们的服务的使用方式。
      </p>
      <p>这些第三方只能为了代表我们执行这些任务而访问您的个人信息，并且有义务不披露或将其用于任何其他目的。</p>
      <h2>安全</h2>
      <p>
        您的个人信息的安全对我们很重要，但请记住，没有一种互联网传输方法或电子存储方法是 100%
        安全的。虽然我们努力使用商业上可接受的方式来保护您的个人信息，但我们不能保证其绝对安全。
      </p>
      <h2>第三方的网站</h2>
      <p>
        我们的服务可能包含指向非我们运营的其他网站的链接。如果您点击第三方链接，您将被定向到该第三方的网站。我们强烈建议您查看您访问的每个网站的隐私政策。
      </p>
      <p>我们无法控制任何第三方网站或服务的内容、隐私政策或做法，也不承担任何责任。</p>
      <h2>儿童隐私</h2>
      <p>
        我们的服务不针对 13 岁以下的任何人。我们不会故意收集 13
        岁以下任何人的个人身份信息。如果您是父母或监护人，并且您知道您的孩子已向我们提供个人数据，请联系我们。如果我们发现我们在未经父母同意的情况下收集了
        13 岁以下任何人的个人数据，我们将采取措施从我们的服务器中删除该信息。
      </p>
      <h2>遵守法律</h2>
      <p>在某些情况下，如果法律要求或响应公共机构（例如法院或政府机构）的有效要求，公司可能需要披露您的个人数据。</p>
      <h2>本隐私政策的变更</h2>
      <p>我们可能会不时更新我们的隐私政策。我们将通过在此页面上发布新的隐私政策来通知您任何更改。</p>
      <p>建议您定期查看本隐私政策以了解任何变更。本隐私政策的更改在发布到本页面后即生效。</p>
      <h2>联系我们</h2>
      <p>如果你对本隐私政策有任何疑问，请联系我们: support@resolid.tech</p>
    </div>
  );
}
