function remicon_get_factorylist(id) {
  num_remicon_list++;

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
      ajax: `/api/remicon_factorylist_table/${id}`,
      table: "#remicon_factorylist_table",
      fields: [
        {
          label: "레미콘 공장",
          name: "companies.name",
        },
        {
          label: "레미콘 주소",
          name: "companies.address",
        },
      ],
    });
    // 항목별 검색기능
    if (num_remicon_list == 1) {
      $("#remicon_factorylist_table thead tr")
        .clone(true)
        .appendTo("#remicon_factorylist_table thead")
        .addClass("fac_filters_factorylist");
    }
    $("#remicon_factorylist_table").DataTable({
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
            var cell = $(".fac_filters_factorylist th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".fac_filters_factorylist th").eq(
                $(api.column(colIdx).header()).index()
              )
            )
              .off("keyup change")
              .on("change", function (e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

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
              });
          });
      },
      // 항목별 검색기능 끝. keyid		url:`/api/remicon_factorylist_table/:${id}`,
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/remicon_factorylist_table/${id}`,
        type: "POST",
      },
      language: lang_kor,
      columns: [
        // { data: "assignments.id"},
        { data: "companies.name" },
        { data: "companies.address" },
      ],
      serverSide: true,
      select: true,
      destroy: true,
      buttons: [],
    });
  });
}
