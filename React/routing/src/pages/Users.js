import { Link } from 'react-router-dom';

function UsersPage(){

    const users = [
        {
            id: 1,
            name: 'User1'
        },
        {
            id: 2,
            name: 'User2'
        }
    ]
    return (
    <div>
        <p>This is the Users Page</p>
        <ul>
            {users.map((user) => {
                return (
                    <li>
                        <Link to={'/users/' + user.id}>{user.id}</Link>
                    </li>
                );
        })}
        </ul>
    </div>)
}

export default UsersPage;