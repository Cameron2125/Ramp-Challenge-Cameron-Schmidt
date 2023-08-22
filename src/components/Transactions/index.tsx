import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"
import { RegisteredEndpoints } from "../../utils/fetch"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, clearCacheByEndpoint, loading } = useCustomFetch()


  //constant to clear cache so display values are always updated when a approval is changed
  const endpointsToClear:RegisteredEndpoints[] = ["paginatedTransactions", "transactionsByEmployee" ]

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })

      //clear cache for reason above
      clearCacheByEndpoint(endpointsToClear);
    },
    [fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
