import { useEffect, useState } from "react"

import {
  AccountLabelBadge,
  LabelEditorDialog,
} from "@/components/UserSettings/AccountLabelBadge"
import { AddAccountDialog } from "@/components/UserSettings/AddAccountDialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useAuth from "@/hooks/useAuth"
import {
  type StoredAccount,
  getAccounts,
  getActiveAccountId,
  updateAccountLabel,
} from "@/lib/accounts"
import { getInitials } from "@/utils"

function RemoveAccountDialog({
  account,
  onConfirm,
}: {
  account: StoredAccount
  onConfirm: () => void
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          移除
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>移除账号</DialogTitle>
          <DialogDescription>
            将从本设备移除{" "}
            <strong>{account.fullName || account.email || "该账号"}</strong>
            。这只会清除本地保存的登录信息，不会删除该账号本身，随时可以重新登录添加回来。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              移除
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AccountRow({
  account,
  isActive,
  onChanged,
}: {
  account: StoredAccount
  isActive: boolean
  onChanged: () => void
}) {
  const { switchAccount, removeAccount } = useAuth()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-zinc-600 text-white">
            {getInitials(account.fullName || account.email || "User")}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">
            {account.fullName || "未命名账号"}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {account.email || "邮箱未知"}
          </span>
        </div>
        <LabelEditorDialog
          label={account.label}
          onSave={(label) => {
            updateAccountLabel(account.id, label)
            onChanged()
          }}
          trigger={
            <button type="button" className="cursor-pointer">
              <AccountLabelBadge label={account.label} />
            </button>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        {isActive ? (
          <span className="text-sm font-medium text-muted-foreground">
            当前使用中
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchAccount(account.id)}
          >
            切换到此账号
          </Button>
        )}
        <RemoveAccountDialog
          account={account}
          onConfirm={() => {
            removeAccount(account.id)
            onChanged()
          }}
        />
      </div>
    </div>
  )
}

const AccountsManager = () => {
  const [accounts, setAccounts] = useState<StoredAccount[]>([])
  const [activeAccountId, setActiveAccountIdState] = useState<string | null>(
    null,
  )

  const refresh = () => {
    setAccounts(getAccounts())
    setActiveAccountIdState(getActiveAccountId())
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">账户管理</h3>
          <p className="text-sm text-muted-foreground">
            添加多个账号（比如公司号、个人号），随时切换，无需重新登录。
          </p>
        </div>
        <AddAccountDialog
          onAdded={refresh}
          trigger={<Button>添加账号</Button>}
        />
      </div>

      <div className="flex flex-col gap-3">
        {accounts.map((account) => (
          <AccountRow
            key={account.id}
            account={account}
            isActive={account.id === activeAccountId}
            onChanged={refresh}
          />
        ))}
      </div>
    </div>
  )
}

export default AccountsManager
