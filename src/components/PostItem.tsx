import { PostContent } from "../lib/posts";
import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";

type Props = {
  post: PostContent;
};
export default function PostItem({ post }: Props) {
  return (
    <Link href={"/posts/" + post.slug} className="post-item-link">
      <Date date={parseISO(post.date)} />
      <h2>{post.title}</h2>
      <style jsx>
        {`
          .post-item-link {
            color: #222;
            display: inline-block;
          }
          h2 {
            margin: 0;
            font-weight: 500;
          }
        `}
      </style>
    </Link>
  );
}
