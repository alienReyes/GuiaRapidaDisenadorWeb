

$( document ).ready(function() {
    console.log( "ready!" );



$.getJSON('js/data.json', function(data) {
    var template = document.getElementById('gridTemplate').innerHTML;
    $.each(data.items, function(i, item) {
        var html = Mustache.to_html(template, item);
       $('.grid').append(html);
    });
     $.each(data.modals, function(i, item) {
       imageList=$('#imgTemplate').html();

       var templateModal= document.getElementById('modalTemplate').innerHTML;
        var images=item.images;
      console.log (imageList)
         var htmlModal = Mustache.to_html(templateModal, item,images,imageList);
         $('#modalContainer').append(htmlModal);
     });

});

});
//
// $grid.on( 'click', '.grid-item-content', function() {
// var flag=false;
// if ($( this ).parent('.grid-item').hasClass('is-expanded'))
// {
//  flag=true;
// }
//
// $('.grid-item').each(function(index,item){
// if ($(item).hasClass('is-expanded')) {
//     $(item).toggleClass('is-expanded');
//   }
// });
// if (flag==false){
//   $( this ).parent('.grid-item').addClass('is-expanded');
//   flag==true;
// }
//
// $grid.isotope('layout');
// });
