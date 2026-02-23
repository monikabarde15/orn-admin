import { FC } from 'react';

interface IconBlogsProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconBlogs: FC<IconBlogsProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M4 3H16C18.2091 3 20 4.79086 20 7V21H6C4.89543 21 4 20.1046 4 19V3Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                opacity={duotone ? '0.5' : '1'}
                d="M8 7H16M8 11H16M8 15H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default IconBlogs;
