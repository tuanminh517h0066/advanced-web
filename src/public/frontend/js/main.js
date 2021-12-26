$(document).ready(function() {

    //------------------ JS for Posts --------------------

    $('#post_content').on('keyup input', function(){
        var content = $(this).val();
        
        if( content.trim() == '') {
            $('#bt-post').attr('disabled', 'disabled');     
            return;
        }
        
        $('#bt-post').removeAttr('disabled'); 
        return; 
    });

    function readURL(input, element) {
        if (input.files && input.files[0]) {
            var reader = new FileReader()
            reader.onload = function (e) {
                $('#option').html('<img src="'+ e.target.result + '">');
                $('#bt-post').removeAttr('disabled'); 
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function getYoutubeId(youtube)  {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (youtube.match(p)) ? RegExp.$1 : false;
    }

    function formatDate(dates) {
        var date = new Date(dates);
        var dateStr =
        ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
        ("00" + date.getDate()).slice(-2) + "/" +
        date.getFullYear() + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);
        return dateStr
    }

    $("#upload-image").change(function() {
        
        readURL(this, $(this))

        $('#upload-video').val('');
    });

    $(document).on('click', '.video-btn', function() {
        $('#option').html('<input type="text" id="upload-video" name="video" placeholder=" please input link of youtube video" >');
        $('#upload-image').val('');
        var content = $('#post_content').val();

        if( content.trim() == '') {
            $('#bt-post').attr('disabled', 'disabled');     
            return;
        }
    });

    $('#upload-video').on('keyup input', function(){
        
        console.log('1')
        $('#bt-post').removeAttr('disabled');
    });



    $(document).on('click', '.create_post', function() {
        console.log(1)
        $('#postModal').find('#title_content').val('');
        $('#postModal').find('#post_content').val('');
        $('#postModal').find('#post_id').val('');
        $('#postModal').find('#upload-video').val('');
        $('#postModal').find('#upload-image').val('');
        $('#postModal').find('#video').val('');
        $('#postModal').find('#option').html('');
        $('#postModal').modal('show');


    });

    $(document).on('click', '.edit_post', function() {  
        var id = $(this).data('id');
        $('#postModal').modal('show');
        console.log(id);
        $.ajax({
            url: '/post/edit',
            data: {
                id: id,
            },
            type: 'post',
            success: function(data) {
                console.log(data);
                if(data._id) {
                    console.log(data.content);
                    $('#postModal').find('#title_content').val(data.title);
                    $('#postModal').find('#post_content').val(data.content);
                    
                    $('#postModal').find('#post_id').val(data._id);
                    // $('#postModal').find('#department_id').val(data.department._id);
                    if(data.image) {
                        $('#option').html('<img src="/uploads/' + data.image + '">');
                    }
                    else if(data.video){
                        
                        $('#option').html('<input type="text" id="upload-video" name="video" value="'+ data.video +'" placeholder="please input link of youtube video" >');
                    }
                    
                    $('#postModal').modal('show');
                    
                }
            }
        }); 
    });

    $("#postForm").submit(function (e) {
        e.preventDefault();
        console.log(this);
        var formData = new FormData(this);
        

        $.ajax({
            type: "POST",
            url: "/post/new",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
                if(data.success == true) {
                    var status_edit_del = 1;
                    if(data.type == 'update') {
                        console.log(data.post);
                        var post = postForm(data.post,status_edit_del, data.current_account);

                        $('#postModal').modal('hide');

                        $( '#post-item' + data.post._id + '' ).html(post);

                    } else {
                        console.log(data.post);

                            var post = '<div class="central-meta item" id="post-item' + data.post._id + '">'
                             post += postForm(data.post,status_edit_del);
                            post += '</div>'
                            $('#postModal').modal('hide');
                            $( ".loadMore" ).prepend( post );
                            var post_length = $(".loadMore > .central-meta").length
                            console.log(post_length);
                            // {{!-- if(post_length > 5) {
                            //     $('.loadMore').children().last().remove();
                            // } --}}
                        
                    }
                }
            },
        });
    });


    var startFrom = 5;

    //  $(document).on('click', '#btn-loadMore', function() {
    //     console.log(startFrom);
        
    //     $.ajax({
    //         type: "post",
    //         url: "/post/loadmore",
    //         data: {
    //             start: startFrom,
    //         },
            
    //         success: function(data) {
    //             console.log(data);
                
                
    //             var post ='';
    //             data.forEach(function(element) {  
    //                 post += '<div class="central-meta item" id="post-item' + element._id + '">'
    //                 post += postForm(element);
    //                 post += '</div>'
                    
    //             }); 
    //             $( ".loadMore" ).append( post );
    //             startFrom = startFrom+2;
    //         }
    //     });
    // });



    $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
            // var load = loadForm();
            // $('#load').removeAttr('hidden');
            $.ajax({
                type: "post",
                url: "/post/loadmore",
                data: {
                    start: startFrom,
                },
                
                success: function(data) {
                    console.log(data.posts);
                    console.log(data.current_account);
                    var load = loadForm();
                    if(data.posts.length > 0) {
                        if ($("#load")[0]){
                            // Do something if class exists
                        } else {
                            
                            $('.loadMore').append(load);
                        }
                    }
                    // $('.loadMore').append(load);
                    
                    setTimeout(function (){
                        console.log("check time out")
                        // $('.loadingPost').hide();
                        $('.loadMore').find('#load').remove();
                        var status_edit_del = 0;
                        var post ='';
                        data.posts.forEach(function(element) {  
    
                            if(String(data.current_account) === String(element.user._id)) {
                                status_edit_del = 1
                            }
    
                            post += '<div class="central-meta item" id="post-item' + element._id + '">'
                            post += postForm(element, status_edit_del, data.current_account);
                            post += '</div>'
                            
                        }); 
                        $( ".loadMore" ).append( post );
                        
                    }, 1000);
                    
                    startFrom = startFrom+2;
                    
                },
            });
        }
    });

    function loadForm() {
        load = '<div class="central-meta item" id="load">';
        // load  = '<div id="checkLoad">'
        load += '<div class="header-post">'
		load += '<div class="space-img"></div>'						
		load += '<div class="space-friend-name">'							
		load += '<div class="space-name"></div>'							
		load += '<div class="space-span"></div>'								
		load += '</div>'									
		load += '</div>'							
		load += '<div class="body-post">'						
		load += '<div class="space"></div>'						
		load += '<div class="space"></div>'							
		load += '<div class="space"></div>'							
		load += '</div>'							
		load += '</div>'
        
        return load;					

    }

    function postForm(data, status_edit_del, current_account) {
        
        var post = '<div class="user-post">'
        post += '<div class="friend-info" style=" display: inline-block;">'
            
        if(status_edit_del == 1) {
        post += '<div class="edit-menu dropleft">'
        post += '<button type="button" id="btn-edit-menu" class="btn btn-light dropdown-toggle-" data-toggle="dropdown" aria-expanded="false">'									
        post += '<i class="fas fa-ellipsis-h"></i>'									
        post += '</button>'									
        post += '<div class="dropdown-menu" aria-labelledby="btn-edit-menu" >'
        post += '<a class="dropdown-item edit_post" href="javascript:void(0);" data-id="' + data._id + '">Edit</a>'								
        post += '<a class="dropdown-item delete_post" href="javascript:void(0);" data-id="' + data._id + '">Delete</a>'
        post += '</div>'			
        post += '</div>'	
        }					


        post += '<figure><img src="/frontend1/images/resources/friend-avatar10.jpg" alt=""></figure>'
        post += '<div class="friend-name">'
        post += '<ins><a href="time-line.html" title="">' + data.user.username + '</a></ins>'
        post += '<span>published: ' +  formatDate(data.updatedAt) + '</span>'
        post += '</div>'
        post += '<div class="description">'
        post += '<p>' + data.content + '</p>'
        post += '</div>'
        post += '<div class="post-meta">'
        if(data.image) {
        post += '<img src="/uploads/' + data.image + '" height="315" alt="">'
        }
        
        if(data.video) {
        post += '<iframe src="https://www.youtube.com/embed/' + getYoutubeId(data.video) + '" height="315" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
        }

        post += '<div class="we-video-info">'

        var liked = '';
        var data_like = '';

        data.likes.forEach(function (element){
            console.log('member_like'+element.user._id);
            
            
            if (String(element.user._id) === String(current_account)) {
                
                liked = 'liked';
                data_like = element._id;
                
            }
        })	


        post += '<div class="row" >'
		post += '<div class="col-md-6">'											
		post += '<button type="button" class="btn btn-light " id="icon-block">'												
		post += '<span class="like" data-toggle="tooltip" title="like">'													
		post += '<a href="javascript:void(0)" class="total_like bt-like like-post' + data._id + '" data-post-id="' + data._id + '" data-like-id="'+ data_like +'"><i class="far fa-thumbs-up like-post-icon' + data._id + ' '+ liked +'"> Like</i></a>'														
		post += '<ins class="count-like' + data._id + '" >'+ data.likes.length +'</ins>'														
		post += '</span>'													
		post += '</button>'												
		post += '</div>'											
		post += '<div class="col-md-6">'											
		post += '<button type="button" class="btn btn-light " id="icon-block">'												
		post += '<span class="comment" data-toggle="tooltip" title="Comments">'													
		post += '<i class="far fa-comment"> Comments</i>'														
		post += '<ins class="count-comment' + data._id + '">'+ data.comments.length +'</ins>'														
		post += '</span>'													
		post += '</button>'												
		post += '</div>'										
		post += '</div>'			
        
        
        post += '</div>'
        post += '</div>'
        post += '</div>'

        post += '<div class="coment-area">'
        post +=	'<ul class="we-comet">'
            
        // console.log(data.comments);
        data.comments.forEach(function (element){

            var status_edit_del = 0;
            console.log(element.user._id);
            console.log(current_account);

            if (String(element.user._id) === String(current_account)) {
                
                var status_edit_del = 1;
                console.log(status_edit_del);
                
            }

            post +=	'<li id="comment'+ element._id +'">'
            post +=  showComment(element, status_edit_del);					
            post += '</li>'			
        })
        
        //post += '<li>'			
        //post += '<a href="#" title="" class="showmore underline">more comments</a>'				
        //post += '</li>'

        //post comment
        post += '<li class="post-comment">'
		post += '<div class="comet-avatar">'												
		post += '<img src="/frontend/images/resources/comet-1.jpg" alt="">'													
		post += '</div>'												
		post += '<div class="post-comt-box">'												
		post += '<form name="frm-comment" action="" method="post" class="frm-post-comment" id="frm-post{{ this._id }}">'													
		post += '<textarea placeholder="Post your comment" class="inputComment" name="comment"></textarea>'														
		post += '<input type="hidden" name="post_id" value="{{ this._id }}" />'													
		post += '</form>'														
		post += '</div>'											
		post += '</li>'														
        post += '</ul>'		
        post +=	'</div>'
        post += '</div>'
        
        return post
    }

    $(document).on('click', '.delete_post', function() {
        var id = $(this).data('id');
        $('#confirmDeletePost').find('.btn_delete_post').attr('data-id', id);
        $('#confirmDeletePost').modal('show');
    });

    $(document).on('click', '.btn_delete_post', function() {
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/post/delete',
            data: {
                id: id,
            },
            type: 'post',
            success: function(data) {
                if(data._id) {
                    $('#post-item' + data._id).remove();
                    $('#confirmDeletePost').modal('hide');
                }
                
            }
        });
    });

    //------------------JS for Like Button ------------------------------
    $(document).on('click', '.bt-like', function(e) {  
        $_this = $(this);
        var post_id = $(this).data('post-id');
        console.log(post_id);
        var count_like = parseInt($('.count-like' + post_id).text());
        var like_id = $(this).attr('data-like-id');
        console.log(like_id);

        if(like_id) { //remove a like
            $.ajax({
                url:'/post/ajaxRemoveLike',
                type:'POST',
                data:{id:like_id},
                success:function(data){
                    if(data.success == true){
                        count_like = count_like - 1;

                        $('.count-like' + post_id).text(count_like);
                        $('.like-post' + post_id).attr('data-like-id', '');
                        // $('.like-post-icon' + post_id).attr('class', 'far fa-thumbs-up like-post-icon'+post_id);
                        $('.like-post-icon' + post_id).attr('style', 'font-weight: none;');
                        
                        $('.like-post-icon' + post_id).removeClass('liked');
                        
                    }
                }
            });
        } else { //add a like
            $.ajax({
                url:'/post/ajaxLike',
                type:'POST',
                data:{post_id: post_id},
                success:function(data){

                    console.log(data.id);
                    count_like = count_like + 1;

                    $('.count-like' + post_id).text(count_like);
                    $('.like-post' + post_id).attr('data-like-id', data.id);
                    // $('.like-post-icon' + post_id).attr('class', 'fas fa-thumbs-up like-post-icon'+post_id);
                    $('.like-post-icon' + post_id).attr('style', 'font-weight: 900;');
                    $('.like-post-icon' + post_id).addClass('liked');
                    
                }
            }); 
        }
    });

    //------------------JS for Comment area ------------------------------

    $(document).on('keypress', '.frm-post-comment', function(e) {
        if(e.shiftKey) return;

        var _this = $(this);
        var keyCode = e.keyCode || e.which;

        if (keyCode === 13) { 
            
            var comment = _this.find('textarea[name=comment]').val() || '';
            var post_id = _this.find('input[name=post_id]').val();
            

            
            // var id      = _this.find('input[name=comment_id]').val();
            var count_comment = parseInt($('.count-comment' + post_id).text());
            
            if(comment.trim() == '') {
                e.preventDefault();          
                return false;
            }

            $.ajax({
            url:'/post/ajaxAddComment',
            type:'POST',
            data:{
                comment:comment, 
                post_id:post_id,
            },
            success:function(data) {
                console.log('check exist')
                console.log(data.comment);
                count_comment = count_comment + 1;
                
                var status_edit_del = 1;

                $('.count-comment' + post_id).text(count_comment);
                _this.find('textarea[name=comment]').val('');

                var comment = '';
                comment += '<li id="comment'+ data.comment._id +'">'
                comment += 	showComment(data.comment, status_edit_del);			
                comment += '</li>'		

                $( ".we-comet" ).prepend( comment );	

                            
                
            }
            });

            e.preventDefault();
            return false;
        }
    });

    function showComment(data, status_edit_del) {
        var comment = '<div class="comet-avatar">'								
            comment += '<img src="/frontend/images/resources/comet-1.jpg" alt="">'									
            comment += '</div>'								
            comment += '<div class="we-comment">'								
            comment += '<div class="coment-head">'									
            comment += '<h5><a href="time-line.html" title="">'+ data.user.username +'</a></h5>'										
            comment += '<span>'+ formatDate(data.user.createdAt) +'</span>'
                if(status_edit_del == 1) {	

                comment += '<div class="edit-menu dropleft">'
                                                            
                    comment += '<button type="button" id="btn-edit-menu" class="btn btn-light dropdown-toggle-" data-toggle="dropdown" aria-expanded="false">'											
                    comment += '<i class="fas fa-ellipsis-h"></i>'													
                    comment += '</button>'												

                    comment += '<div class="dropdown-menu" aria-labelledby="btn-edit-menu" >'
                    comment += '<a class="dropdown-item delete_comment" href="javascript:void(0);" data-id="'+ data._id +'">Delete</a>'												
                    comment += '</div>'											
                comment += '</div>'
                }										
            comment += '</div>'					

            comment += '<p>'+ data.comment +'</p>'									
            comment += '</div>'
        
        return comment;
    }


    $(document).on('click','.delete_comment', function(){
        var id = $(this).attr('data-id');
        

        var post_id = $('.frm-post-comment').find('input[name=post_id]').val();
        var count_comment = parseInt($('.count-comment' + post_id).text());
        
        
        $.ajax({
            url: '/post/ajaxDeleteComment',
            data: {
                comment_id: id,
            },
            type: 'post',
            success: function(data) {
                
                if(data.success == true){
                    count_comment = count_comment - 1;

                    $('.count-comment' + post_id).text(count_comment);
                    
                    $('#comment' + id).remove();
                }
                
            }
        });
    })

})