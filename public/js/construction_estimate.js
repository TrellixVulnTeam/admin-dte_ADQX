// 건설사견적내역
function getApi(id) {
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

  // window.location.reload();
  var editor; // use a global for the submit and return data rendering in the examples
  // var id = sessionStorage.getItem("id", id);
  console.log("키값확인", id);
  if (id === null) {
    retrun;
  }
  $(document).ready(function () {
    //CRUD

    editor = new $.fn.dataTable.Editor({
      ajax: `/api/construction_esimate_management_list/${id}`,
      table: "#construction_esimate_table",
      fields: [
        {
          label: "레미콘 공장",
          name: "spaces.name",
        },
        {
          label: "레미콘 공장 주소",
          name: "spaces.basic_address",
        },
        {
          label: "영업사원",
          name: "users.name",
        },
        {
          label: "단가율",
          name: "estimations.percent",
        },
        {
          label: "견적요청 일시",
          name: "estimations.created_at",
        },
        {
          label: "상태",
          name: "estimations.status",
        },
      ],
    });

    // 항목별 검색기능
    $("#construction_esimate_table thead tr")
      .clone(true)
      .addClass("filters")
      .appendTo("#construction_esimate_table thead tr");

    $("#construction_esimate_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      destroy: true,
      // searching: true,
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
        url: `/api/construction_esimate_management/${id}`,
        // type: "get",
      },
      destroy: true,
      select: true,
      language: lang_kor,
      columns: [
        { data: "spaces.name" },
        { data: "spaces.basic_address" },
        { data: "users.name" },
        { data: "estimations.percent" },
        { data: "estimations.created_at" },
        {
          data: "estimations.status",
          render: function (data, type, row) {
            switch (data) {
              case "REQUESTED":
                return "요청";
                break;
              case "RESPONDED":
                return "응답";
                break;
              case "REGISTERED":
                return "등록";
                break;
              case "APPLIED":
                return "적용";
                break;
              case "FINISHED":
                return "완료";
                break;
              case null:
                return "";
                break;
            }
          },
        },
      ],

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
