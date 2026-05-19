import CreateWedding from "../features/wedding-builder/CreateWedding";

/**
 * CreateWeddingPage — thin wrapper, renders the wedding builder.
 * Mounted by builderRoutes on /create/wedding and /create/wedding/:draftId.
 */
export default function CreateWeddingPage() {
    return <CreateWedding />;
}
