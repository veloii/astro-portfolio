import React, { createContext, useId, useState } from "react"
import { cn } from "./cn"
import { motion, type Transition } from "motion/react"

// ---------------------------------------------------------------------------
// Inline transition
// ---------------------------------------------------------------------------

const snappyTransition: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 40,
}

const baseChip =
  "inline-flex h-7.5 w-fit shrink-0 cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-3 text-sm font-medium whitespace-nowrap select-none"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Option {
  value: string
  label?: string
}

interface SegmentedRangeSelectorProps {
  name: string
  options: Option[]
  value: string[]
  onValueChange: (value: string[]) => void
}

// ---------------------------------------------------------------------------
// Shared state provider (coordinates multiple selectors so only one selects
// at a time)
// ---------------------------------------------------------------------------

const SegmentedRangeSelectorContext = createContext<{
  state: (
    key: string
  ) => readonly [string | null, (value: string | null) => void]
}>({ state: () => [null, () => { }] })

function useSegmentedRangeSelectorState(key: string) {
  const { state } = React.useContext(SegmentedRangeSelectorContext)
  return state(key)
}

export function SegmentedRangeSelectorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<Record<string, string | null>>({})

  const state = (key: string) =>
    [
      value[key],
      (value: string | null) =>
        setValue((existingValue) => ({ ...existingValue, [key]: value })),
    ] as const

  return (
    <SegmentedRangeSelectorContext.Provider value={{ state }}>
      {children}
    </SegmentedRangeSelectorContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// SegmentedRangeSelector
// ---------------------------------------------------------------------------

export function SegmentedRangeSelector({
  name,
  options,
  value,
  onValueChange,
}: SegmentedRangeSelectorProps) {
  const componentId = useId()
  const [selecting, setSelecting] = useSegmentedRangeSelectorState(name)

  const updateOptions = (opts: Option[]) => {
    return onValueChange(opts.map((o) => o.value))
  }

  const onChipPress = (option: Option) => {
    const pressedIndex = options.findIndex((o) => o.value === option.value)

    const selectingIndex = options.findIndex((o) => o.value === selecting)
    if (selectingIndex !== -1 && pressedIndex > selectingIndex) {
      updateOptions(options.slice(selectingIndex, pressedIndex + 1))
      setSelecting(null)
      return
    }

    if (value.length === 0) {
      updateOptions(options.slice(pressedIndex))
      setSelecting(option.value)
      return
    }

    setSelecting(null)
    updateOptions([])
  }

  const beforeSelected = options.slice(
    0,
    value.length > 0
      ? options.findIndex((o) => o.value === value[0])
      : undefined
  )
  const selected = options.filter((option) => value.includes(option.value))
  const afterSelected =
    value.length > 1
      ? options.slice(
        options.findIndex((o) => o.value === value[value.length - 1]) + 1
      )
      : []

  const inactiveStyle = {
    borderColor: "#e7e5e4",
    background: "#ffffff",
    color: "#78716c",
  } satisfies React.CSSProperties

  const intermediateStyle = {
    borderColor: "transparent",
    background: "transparent",
    color: "#1c1917",
  } satisfies React.CSSProperties

  const activeStyle = {
    borderColor: "transparent",
    background: "transparent",
    color: "#fafaf9",
  } satisfies React.CSSProperties

  const transition = snappyTransition
  const gap = 4
  const animateGap = false
  const selectedLayoutId = [componentId, "selected"].join()

  return (
    <div
      className="relative flex rounded-full bg-[#f5f5f4] p-1"
      style={{ gap }}
    >
      {beforeSelected.map((option) => (
        <div
          onClick={() => onChipPress(option)}
          key={option.value}
          style={inactiveStyle}
          className={cn(baseChip, selected.length > 1 && "cursor-not-allowed")}
        >
          {option.label ?? option.value}
        </div>
      ))}

      {selected.length > 0 && (
        <div
          className={cn("relative z-0 flex rounded-full")}
          style={{ gap: animateGap ? 0 : 4 }}
        >
          {selected.length > 0 && (
            <div
              style={{
                clipPath: "inset(0 -9999px 0 0 round 9999px 0 0 9999px)",
              }}
              className="absolute inset-0 -z-10"
            >
              <motion.div
                layout="x"
                initial={{ translateX: "-100%" }}
                animate={{ translateX: 0 }}
                transition={snappyTransition}
                style={{
                  borderRadius: 9999,
                }}
                className={cn("pointer-events-none size-full", "bg-[#1c1917]/15")}
              />
            </div>
          )}

          {selecting === null && selected.length > 0 && (
            <motion.div
              className="absolute left-0 w-full h-full origin-left -z-10 bg-[#1c1917]"
              style={{
                borderRadius: 9999,
              }}
              layoutId={selectedLayoutId}
              layout="size"
              layoutCrossfade={false}
              transition={transition}
            />
          )}

          {selected.map((option, index) => {
            const isActive = selecting === null || selecting === option.value
            const animate = isActive ? activeStyle : intermediateStyle

            return (
              <div key={option.value} className="relative">
                <motion.div
                  onClick={() => onChipPress(option)}
                  className={cn(
                    "transition-none",
                    baseChip,
                    (!selecting || selecting === option.value) &&
                    "cursor-not-allowed"
                  )}
                  initial={{
                    ...inactiveStyle,
                    marginLeft: animateGap ? (index !== 0 ? gap : 0) : 0,
                  }}
                  animate={{ ...animate, marginLeft: 0 }}
                  transition={transition}
                >
                  {option.label ?? option.value}
                </motion.div>

                {selecting === option.value && (
                  <motion.div
                    className="absolute inset-0 -z-10 bg-[#1c1917]"
                    layoutId={selectedLayoutId}
                    style={{
                      borderRadius: 9999,
                    }}
                    layoutCrossfade={false}
                    transition={transition}
                    layout="size"
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {afterSelected.map((option) => (
        <motion.div
          key={option.value}
          onClick={() => onChipPress(option)}
          style={inactiveStyle}
          className={cn(
            selected.length > 1 && "cursor-not-allowed",
            baseChip,
            "transition-none"
          )}
          initial={{
            ...intermediateStyle,
            marginLeft: animateGap ? -gap : 0,
          }}
          animate={{ ...inactiveStyle, marginLeft: 0 }}
          transition={transition}
        >
          {option.label ?? option.value}
        </motion.div>
      ))}
    </div>
  )
}
