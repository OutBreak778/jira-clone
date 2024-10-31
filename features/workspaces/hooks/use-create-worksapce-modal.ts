import { parseAsBoolean, useQueryState } from "nuqs"

const useCreateWorkspaceModal = () => {
    const [ModalisOpen, ModalsetIsOpen] = useQueryState(
        "create-workspace",
        parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true})
    )

    const Modalopen = () => ModalsetIsOpen(true)
    const Modalclose = () => ModalsetIsOpen(false)

    return {
        ModalisOpen: !!ModalisOpen,
        Modalopen,
        Modalclose,
        ModalsetIsOpen
    }
}

export default useCreateWorkspaceModal