const { useNavigate } = require("react-router-dom");

export default function useLogoutHook () {
    const navigate = useNavigate();

    const logout = () => {
        navigate('/login')
    }

    return logout
}

