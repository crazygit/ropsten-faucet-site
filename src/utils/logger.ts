import pino from "pino"

// 浏览器端使用时应该使用logger.info以上级别,debug看不到输出
export const logger = pino({
  name: "app",
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  browser: { asObject: true },
  timestamp: () => `,"datetime":"${new Date(Date.now()).toISOString()}"`,
  formatters: {
    level(label: string, number: number) {
      return { level: label }
    },
    bindings(bindings: pino.Bindings): object {
      return { pid: bindings.pid }
    }
  }
})
