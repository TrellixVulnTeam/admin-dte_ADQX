function remicon_membernum(id) {
  // 구성원 수 리스트를 구하는 함수
  num_remicon_memberlist++;
  console.log("함수호출확인", num_remicon_memberlist);
  console.log("함수호출확인", id);
  var lang_kor = {
    decimal: "",
    emptyTable: "데이터가 없습니다.",
    info: "_START_ 부터- _END_ 까지 (총 _TOTAL_ 데이터)",
    infoEmpty: "0개",
    infoFiltered: "(전체 _MAX_명 중 검색결과)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "_MENU_개씩 보기",
    loadingRecords: "로딩중...",
    processing: "처리중...",
    search: "검색 :",
    zeroRecords: "검색된 데이터가 없습니다.",
    paginate: {
      first: "첫 페이지",
      last: "마지막페이지",
      next: "다음",
      previous: "이전",
    },
    aria: {
      sortAscending: ":오름차순 정렬",
      sortDescending: ":내림차순 정렬",
    },
  };

  var editor; // use a global for the submit and return data rendering in the examples

  if (id === null) {
    retrun;
  }
  $(document).ready(function () {
    //CRUD

    editor = new $.fn.dataTable.Editor({
      ajax: `/api/remicon_memberlist/${id}`,
      table: "#remicon_memberlist_table",
      fields: [
        {
          label: "이름",
          name: "users.name",
        },
        {
          label: "공장명",
          name: "companies.name",
        },
        {
          label: "전화번호",
          name: "users.phone",
        },
      ],
    });
    // 항목별 검색기능

    if (num_remicon_memberlist == 1) {
      $("#remicon_memberlist_table thead tr")
        .clone(true)
        .addClass("re_filters_memberlist")
        .appendTo("#remicon_memberlist_table thead");
    }
    // $("#remicon_memberlist_table thead *").remove();
    $("#remicon_memberlist_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      // destroy: true,
      // searching: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".re_filters_memberlist th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".re_filters_memberlist th").eq(
                $(api.column(colIdx).header()).index()
              )
            )
              .off("keyup change")
              .on("change", function (e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

                // var cursorPosition = this.selectionStart;

                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != ""
                      ? regexr.replace("{search}", "(((" + this.value + ")))")
                      : "",
                    this.value != "",
                    this.value == ""
                  )
                  .draw();
              })
              .on("keyup", function (e) {
                e.stopPropagation();

                $(this).trigger("change");
                $(this).focus()[0];
                // .setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      },
      // 항목별 검색기능 끝.
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/remicon_memberlist/${id}`,
        // type: "get",
      },
      destroy: true,
      select: true,
      language: lang_kor,
      columns: [
        { data: "users.name" },
        { data: "companies.name" },
        { data: "users.phone" },
      ],

      buttons: [
        { extend: "create", editor: editor, text: "등록" },
        { extend: "edit", editor: editor, text: "상세보기 및 수정" },
        { extend: "remove", editor: editor, text: "삭제" },
      ],
    });
  });
}
