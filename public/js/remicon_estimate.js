//레미콘사 견적내역
function remicon_getApi(id) {
  //Korean
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
    aria: { sortAscending: ":오름차순 정렬", sortDescending: ":내림차순 정렬" },
  };
  console.log("확인");
  var editor; // use a global for the submit and return data rendering in the examples

  $(document).ready(function () {
    //CRUD
    editor = new $.fn.dataTable.Editor({
      //`/api/remicon_esimate_management/${id}`,
      ajax: `/api/remicon_esimate_management/${id}`,
      table: "#remicon_esimate_table",
      fields: [
        {
          label: "건설사",
          name: "companies.name",
        },
        {
          label: "건설현장",
          name: "spaces.name",
        },
        {
          label: "건설사주소",
          name: "spaces.basic_address",
        },
        {
          label: "영업사원",
          name: "users.name",
        },

        {
          label: "견적률",
          name: "estimations.percent",
        },
        {
          label: "견적상태",
          name: "estimations.status",
        },
        {
          label: "일시",
          name: "estimations.created_at",
          type: "datetime",
          def: function () {
            return new Date();
          },
          format: "YYYY-MM-DD",
        },
      ],
    });

    // 항목별 검색기능
    $("#remicon_esimate_table thead tr")
      .clone(true)
      .appendTo("#remicon_esimate_table thead tr")
      .addClass("filters");

    $("#remicon_esimate_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      destroy: true,
      searching: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".filters th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="' + title + '" />');

            // On every keypress in this input
            $(
              "input",
              $(".filters th").eq($(api.column(colIdx).header()).index())
            )
              .off("keyup change")
              .on("change", function (e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

                var cursorPosition = this.selectionStart;
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
                $(this)
                  .focus()[0]
                  .setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      },
      // 항목별 검색기능 끝.
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/remicon_esimate_management/${id}`,
      },
      language: lang_kor,
      columns: [
        // { data: "spaces.id" },
        { data: "companies.name" },
        { data: "spaces.name" },
        { data: "spaces.basic_address" },
        { data: "users.name" },
        { data: "estimations.percent" },
        { data: "estimations.status" },
        { data: "estimations.created_at" },
      ],
      select: true,
      buttons: [
        { extend: "create", editor: editor, text: "등록" },
        { extend: "edit", editor: editor, text: "수정" },
        { extend: "remove", editor: editor, text: "삭제" },
        {
          extend: "collection",
          text: "내보내기",
          buttons: ["excel", "csv"],
        },
      ],
    });
  });
}
