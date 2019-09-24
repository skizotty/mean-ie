import { PageEvent } from '@angular/material'
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post!', content: 'This is content for post 1!' },
  //   { title: 'Second Post!', content: 'This is content for post 2!' },
  //   { title: 'Third Post!', content: 'This is content for post 3!' }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10]
  constructor(public postsService: PostService) { }
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((post: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = post.postCount;
        this.posts = post.posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData)
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.isLoading = true;
      this.postsService.getPost(this.postsPerPage, this.currentPage)
    });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
