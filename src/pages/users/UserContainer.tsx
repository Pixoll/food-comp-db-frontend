import React, { useState, useEffect } from 'react';
import AppNavbar from '../../core/components/Navbar';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

type ErrorType = { status: number; statusText: string } | { message: string };

const getData = async (): Promise<Post[] | { error: ErrorType }> => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            console.log('error:', response.status);
            return { error: { status: response.status, statusText: response.statusText } };
        }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return { error: { message: 'Fetch failed' } };
    }
};

const UserContainer = () => {
    const [data, setData] = useState<Post[]>([]);
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData();
            if ('error' in result) {
                setError(result.error);
            } else {
                setData(result);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <p>Error: {'message' in error ? error.message : error.statusText}</p>;
    }

    return (
        <div>
            <AppNavbar />
            <h1>Data post: </h1>
            {data && data.length > 0 ? (
                <ul>
                    {data.map((post) => (
                        <li key={post.id}>{post.userId}</li>
                    ))}
                </ul>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default UserContainer;
