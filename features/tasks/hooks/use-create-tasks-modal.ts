import { parseAsBoolean, useQueryState } from "nuqs"

const useCreateTaskstModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-task",
        parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true})
    )

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    return {
        isOpen: !!isOpen,
        open,
        close,
        setIsOpen
    }
}

export default useCreateTaskstModal