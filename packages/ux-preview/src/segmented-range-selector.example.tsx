import { useState } from "react"
import {
  SegmentedRangeSelector,
  SegmentedRangeSelectorProvider,
} from "./segmented-range-selector"

const options = [
  { value: "1", label: "Easy" },
  { value: "2", label: "Medium" },
  { value: "3", label: "Hard" },
  { value: "4", label: "Very Hard" },
  { value: "5", label: "Extreme" },
]

export default function SegmentedRangeSelectorExample() {
  const [value, setValue] = useState<string[]>([])

  return (
    <SegmentedRangeSelectorProvider>
      <SegmentedRangeSelector
        name="difficulty"
        options={options}
        value={value}
        onValueChange={setValue}
      />
    </SegmentedRangeSelectorProvider>
  )
}
