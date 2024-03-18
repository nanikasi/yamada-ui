import type { CSSUIProps } from "@yamada-ui/core"
import { useTheme } from "@yamada-ui/core"
import type { Dict } from "@yamada-ui/utils"
import { cx } from "@yamada-ui/utils"
import { useCallback, useMemo } from "react"
import type * as Recharts from "recharts"
import { getComponentProps } from "./chart-utils"
import type { ChartPropGetter, TooltipProps } from "./chart.types"
import { tooltipProperties } from "./rechart-properties"

export type UseChartTooltipProps = {
  /**
   * Props passed down to recharts 'Tooltip' component.
   */
  tooltipProps?: TooltipProps
  /**
   * Specifies the duration of animation, the unit of this option is ms.
   *
   * @default 0
   */
  tooltipAnimationDuration?: number
  /**
   * A function to format values on Y axis and inside the tooltip
   */
  valueFormatter?: (value: number) => string
}

export const useChartTooltip = ({
  tooltipProps: _tooltipProps = {},
  tooltipAnimationDuration = 0,
  valueFormatter,
}: UseChartTooltipProps) => {
  const { theme } = useTheme()
  const {
    cursor = {
      fill: ["blackAlpha.200", "whiteAlpha.200"],
      stroke: ["blackAlpha.300", "whiteAlpha.300"],
      strokeWidth: 1,
      strokeDasharray: "",
    },
    ...rest
  } = _tooltipProps

  const tooltipVars: CSSUIProps["var"] = useMemo(
    () => [
      {
        __prefix: "ui",
        name: "cursor-fill",
        token: "colors",
        value: cursor.fill!,
      },
      {
        __prefix: "ui",
        name: "cursor-stroke",
        token: "colors",
        value: cursor.stroke!,
      },
      {
        __prefix: "ui",
        name: "cursor-stroke-width",
        token: "colors",
        value: cursor.strokeWidth!,
      },
      {
        __prefix: "ui",
        name: "cursor-stroke-dasharray",
        token: "colors",
        value: cursor.strokeDasharray!,
      },
    ],
    [cursor.fill, cursor.stroke, cursor.strokeDasharray, cursor.strokeWidth],
  )

  const [tooltipProps, propClassName] = getComponentProps<Dict, string>([
    rest,
    tooltipProperties,
  ])(theme)

  const getTooltipProps: ChartPropGetter<
    "div",
    Partial<Recharts.TooltipProps<any, any>>,
    Omit<Recharts.TooltipProps<any, any>, "ref">
  > = useCallback(
    ({ labelClassName, wrapperClassName, ...props } = {}, ref = null) => ({
      ref,
      labelClassName: cx(labelClassName, propClassName),
      wrapperClassName: cx(wrapperClassName, propClassName),
      animationDuration: tooltipAnimationDuration,
      isAnimationActive: (tooltipAnimationDuration || 0) > 0,
      formatter: valueFormatter,
      cursor: {
        fill: "var(--ui-cursor-fill)",
        stroke: "var(--ui-cursor-stroke)",
        strokeWidth: "var(--ui-cursor-stroke-width)",
        strokeDasharray: "var(--ui-cursor-stroke-dasharray)",
      },
      ...props,
      ...tooltipProps,
    }),
    [propClassName, tooltipAnimationDuration, valueFormatter, tooltipProps],
  )

  return { getTooltipProps, tooltipVars }
}
