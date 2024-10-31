import { parseAsBoolean, useQueryState } from "nuqs"

const useCreateProjectModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-projects",
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

export default useCreateProjectModal