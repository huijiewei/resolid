import { mergeMeta } from "@resolid/framework/utils";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "服务协议" }];
});

// noinspection JSUnusedGlobalSymbols
export default function TermsService() {
  return (
    <div className={"prose dark:prose-invert mx-auto max-w-3xl px-4 py-8"}>
      <h1 className={"text-center"}>服务协议</h1>
      <p>最后更新: 2024 年 04 月 16 日</p>
      <p>
        在使用 Resolid Tech（“我们”、“我们的”）运营的 https://www.resolid.tech
        网站（“服务”）之前，请仔细阅读这些使用条款（“条款”、“使用条款”）。
      </p>
      <p>你访问和使用服务的条件是你接受并遵守这些条款。这些条款适用于所有访问者、用户和其他访问或使用服务的人。</p>
      <p>通过访问或使用服务，你同意受这些条款的约束。如果你不同意条款的任何部分，则你不得访问服务。</p>
      <h2>账户</h2>
      <p>
        当你在我们这里创建帐户时，你必须始终向我们提供准确、完整和最新的信息。否则将构成对条款的违反，这可能会导致你在我们的服务上的帐户立即终止。
      </p>
      <p>
        你有责任保护你用于访问服务的密码以及在你的密码下进行的任何活动或操作，无论你的密码是用于我们的服务还是第三方服务。
      </p>
      <p>你同意不向任何第三方透露你的密码。一旦发现任何违反安全或未经授权使用你帐户的行为，你必须立即通知我们。</p>
      <h2>知识产权</h2>
      <p>本服务及其原始内容、特性和功能现在和将来都是 Resolid Tech 及其许可方的专有财产。</p>
      <h2>第三方的网站</h2>
      <p>我们的服务可能包含非 Resolid Tech 所有或控制的第三方网站或服务的链接。</p>
      <p>
        Resolid Tech
        无法控制任何第三方网站或服务的内容、隐私政策或做法，也不承担任何责任。你进一步承认并同意，对于因使用或依赖或使用或依赖任何此类内容、商品或服务而造成或声称造成的任何损害或损失，Resolid
        Tech 不承担任何直接或间接的责任。通过任何此类网站或服务。
      </p>
      <p>我们强烈建议你阅读你访问的任何第三方网站或服务的条款和条件以及隐私政策。</p>
      <h2>终止服务</h2>
      <p>我们可能出于任何原因（包括但不限于你违反本条款）立即终止或暂停你的帐户，恕不另行通知，也不承担任何责任。</p>
      <p>终止后，你使用服务的权利将立即终止。如果你想终止你的帐户，你只需停止使用该服务即可。</p>
      <p>
        本条款中根据其性质应在终止后继续有效的所有条款应在终止后继续有效，包括但不限于所有权条款、保证免责声明、赔偿和责任限制。
      </p>
      <h2>免责声明</h2>
      <p>
        你自行承担使用本服务的风险。该服务按“现状”和“可用”的基础提供。本服务不提供任何形式的明示或默示保证，包括但不限于适销性、特定用途适用性、不侵权或履行过程的默示保证。
      </p>
      <h2>适用法律</h2>
      <p>
        本条款以及你对服务的使用应受国家/地区法律（不包括法律冲突规则）管辖。你对应用程序的使用还可能受到其他地方、州、国家或国际法律的约束。
      </p>
      <h2>本协议的变更</h2>
      <p>
        我们保留自行决定随时修改或替换这些条款的权利。如果修订内容重大，我们将尽合理努力在任何新条款生效之前至少提前 30
        天发出通知。什么构成重大变更将由我们自行决定。
      </p>
      <p>
        在这些修订生效后继续访问或使用我们的服务，即表示你同意受修订条款的约束。如果你不同意全部或部分新条款，请停止使用本网站和服务。
      </p>
      <h2>联系我们</h2>
      <p>如果你对本隐私政策有任何疑问，请联系我们: support@resolid.tech</p>
    </div>
  );
}
