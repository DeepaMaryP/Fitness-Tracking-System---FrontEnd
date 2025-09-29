const allRoles = ["Admin", "Trainer","User"]
const allStatus = ["Active", "InActive"]

export const getRoles = () => {
        const roles = allRoles.map(role =>
            ({ value: role, label: role })
        )
        return roles;
    }

export const getStatus = () => {
     const status = allStatus.map(status =>
            ({ value: status, label: status })
        )
        return status;
}