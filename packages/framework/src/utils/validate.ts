import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import { util, z } from "zod";

export const createResolver: typeof zodResolver = (schema, schemaOptions, resolverOptions = {}) => {
  return zodResolver(
    schema,
    {
      ...schemaOptions,
      errorMap: zodErrorMap,
    },
    resolverOptions,
  );
};

export type ValidateDataResult<T extends FieldValues> =
  | { success: true; values: T }
  | { success: false; errors: FieldErrors<T> };

export const validateData = async <T extends FieldValues>(
  data: T,
  resolver: Resolver<T>,
): Promise<ValidateDataResult<T>> => {
  const { errors, values } = await resolver(data, {}, { shouldUseNativeValidation: false, fields: {} });

  if (Object.keys(errors).length > 0) {
    return { success: false, errors: errors as FieldErrors<T> };
  }

  return { success: true, values: values as T };
};

export const createFieldErrors = <T extends FieldValues = FieldValues>(errors: Record<string, string>) => {
  const fieldErrors: FieldErrors = {};

  for (const error in errors) {
    fieldErrors[error] = {
      type: "custom",
      message: errors[error],
    };
  }

  return fieldErrors as unknown as FieldErrors<T>;
};

const validations = {
  email: "邮件",
  url: "链接",
  uuid: "uuid",
  cuid: "cuid",
  cuid2: "cuid2",
  ulid: "ulid",
  emoji: "表情符号",
  ip: "IP 地址",
  datetime: "日期时间",
  date: "日期",
  time: "时间",
  duration: "期间",
  base64: "base64",
  nanoid: "nanoid",
  cidr: "cidr",
  jwt: "jwt",
  base64url: "base64url",
};

const zodErrorMap: z.ZodErrorMap = (issue, _ctx) => {
  let message: string;

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === z.ZodParsedType.undefined) {
        message = "必填";
      } else {
        message = `预期输入为 ${issue.expected}, 而输入为 ${issue.received}`;
      }
      break;
    case z.ZodIssueCode.invalid_literal:
      message = `错误的字面量值，请输入 ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case z.ZodIssueCode.unrecognized_keys:
      message = `对象中的键无法识别: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case z.ZodIssueCode.invalid_union:
      message = "不满足联合类型中的选项";
      break;
    case z.ZodIssueCode.invalid_union_discriminator:
      message = `标识值无法被区分。请输入 ${util.joinValues(issue.options)}`;
      break;
    case z.ZodIssueCode.invalid_enum_value:
      message = `错误的枚举值. 预期输入为 ${util.joinValues(issue.options)}, 而输入为 '${issue.received}'`;
      break;
    case z.ZodIssueCode.invalid_arguments:
      message = "错误的函数参数格式";
      break;
    case z.ZodIssueCode.invalid_return_type:
      message = "错误的函数返回值格式";
      break;
    case z.ZodIssueCode.invalid_date:
      message = "错误的日期格式";
      break;
    case z.ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `必须包含 "${issue.validation.includes}"`;

          if (issue.validation.position) {
            message = `${message} 在一个或多个位置大于或等 ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `文本必须以 "${issue.validation.startsWith}" 开头`;
        } else if ("endsWith" in issue.validation) {
          message = `文本必须以 "${issue.validation.endsWith}" 结尾`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `错误的 ${validations[issue.validation]} 格式`;
      } else {
        message = "错误的输入格式";
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === "array") {
        message = `数组元素${issue.exact ? "必须为" : issue.inclusive ? "至少为" : "须多于"} ${issue.minimum} 个`;
      } else if (issue.type === "string") {
        message = `文本长度${issue.exact ? "必须为" : issue.inclusive ? "至少为" : "须多于"} ${issue.minimum} 个字符`;
      } else if (issue.type === "number") {
        message = `数值必须${issue.exact ? "为" : issue.inclusive ? "大于或等于" : "大于"} ${issue.minimum}`;
      } else if (issue.type === "date") {
        message = `日期必须${issue.exact ? "为" : issue.inclusive ? "大于或等于" : "大于"} ${new Date(
          Number(issue.minimum),
        )}`;
      } else {
        message = "错误的输入格式";
      }
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === "array") {
        message = `数组元素${issue.exact ? "必须为" : issue.inclusive ? "最多为" : "须少于"} ${issue.maximum} 个`;
      } else if (issue.type === "string") {
        message = `文本长度${issue.exact ? "必须为" : issue.inclusive ? "最多为" : "须少于"} ${issue.maximum} 个字符`;
      } else if (issue.type === "number" || issue.type === "bigint") {
        message = `数值必须${issue.exact ? "为" : issue.inclusive ? "小于或等于" : "小于"} ${issue.maximum}`;
      } else if (issue.type === "date") {
        message = `日期必须${issue.exact ? "为" : issue.inclusive ? "小于或等于" : "小于"} ${new Date(
          Number(issue.maximum),
        )}`;
      } else {
        message = "错误的输入格式";
      }
      break;
    case z.ZodIssueCode.custom:
      message = "错误的输入格式";
      break;
    case z.ZodIssueCode.invalid_intersection_types:
      message = "交叉类型结果无法被合并";
      break;
    case z.ZodIssueCode.not_multiple_of:
      message = `数值必须是 ${issue.multipleOf} 的倍数`;
      break;
    case z.ZodIssueCode.not_finite:
      message = "数值必须有限";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
