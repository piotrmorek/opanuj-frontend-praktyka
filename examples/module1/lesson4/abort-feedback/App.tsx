import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

const API_URL = '/api/data/users?timeout=10000';

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [connectivityProblem, setConnectivityProblem] = useState(false);

  let abortController: AbortController | undefined;

  const loadUsers = async () => {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    const timeout = setTimeout(() => {
      setConnectivityProblem(true);
    }, 5000);

    fetch(API_URL, { signal: abortController.signal })
      .then((res) => res.json())
      .then(({ users }) => {
        setUsers(users);
        setConnectivityProblem(false);
      })
      .finally(() => clearTimeout(timeout));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex flex-row items-center">
          {connectivityProblem && (
            <p className="mr-2">
              Sorry, there seems to be connectivity issues...
            </p>
          )}
          <button
            className="text-white bg-blue-800 hover:text-blue-200 hover:bg-blue-400 rounded-md p-4"
            onClick={loadUsers}
          >
            Try again
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li
            className="bg-white p-4 rounded-md border border-gray-100"
            key={index}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
